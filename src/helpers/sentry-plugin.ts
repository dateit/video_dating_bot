import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import * as Sentry from '@sentry/node';
import { Transaction, Severity } from '@sentry/types';
import * as Tracing from '@sentry/tracing';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface FastifyRequest {
    sentryTx: Transaction | null;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface FastifyInstance {
    Sentry: typeof Sentry;
  }
}

interface ISentryPluginOptions extends FastifyPluginOptions {
  environment: string;
  dsn: string;
}

export const fastifySentry = fp(async (app: FastifyInstance, options: ISentryPluginOptions) => {
  Sentry.init(options);

  Tracing.addExtensionMethods();

  Sentry.configureScope(scope => {
    scope.addEventProcessor(event => {
      const traceData = event.contexts?.trace?.data as {
        user: {
          username: string;
          id: string;
        };
        request?: {
          method: string;
        };
      };

      if (!traceData) {
        return event;
      }

      const { request, user } = traceData;
      if (request) {
        event.request = {
          method: request.method,
          ...event.request,
        };
      }

      if (user) {
        event.user = {
          username: user.username,
          id: user.id,
          ...event.user,
        };
      }

      return event;
    });
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    if (reply.statusCode === 500) {
      reply.send(new Error('Something went wrong'));
    } else {
      reply.send(error);
    }

    Sentry.withScope(scope => {
      scope.setLevel(Severity.Error);
      scope.setTag('path', request.url);
      scope.setExtra('headers', request.headers);
      scope.setExtra('body', request.body);
      Sentry.captureException(error);
    });
  });

  // eslint-disable-next-line unicorn/no-null
  app.decorateRequest('sentryTx', null);

  app.addHook('onRequest', (request: FastifyRequest, _reply: FastifyReply, done) => {
    request.sentryTx = Sentry.startTransaction({
      name: `${request.method} ${request.url}`,
      op: 'http.server',
      description: 'HTTP request',
    });
    request.sentryTx?.setData('request', { method: request.method });
    done();
  });

  app.decorate('Sentry', Sentry);

  app.addHook('onResponse', (request: FastifyRequest, reply: FastifyReply, done) => {
    request.sentryTx?.setHttpStatus(reply.statusCode);
    request.sentryTx?.finish();
    done();
  });

  app.addHook('onClose', (_instance, done) => {
    Sentry.close(2000).then(() => done(), done);
  });
});
