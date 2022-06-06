interface IMessage {
  text: string;
}

/**
 * Last argument will contain the rest of the message.
 */
export const parseCommandArguments = <M extends IMessage, C extends string, A extends string>(
  message: M,
  command: C,
  argumentNames: readonly A[],
) => {
  const _arguments = message.text.replace(`/${command}`, '').split(' ').filter(Boolean);

  if (_arguments.length === 0) {
    return {} as Record<A, string | undefined>;
  }

  // eslint-disable-next-line unicorn/no-array-reduce
  return argumentNames.reduce((accumulator, argument, index) => {
    if (index === argumentNames.length - 1) {
      accumulator[argument] = _arguments.slice(index).join(' ');
    } else {
      accumulator[argument] = _arguments[index];
    }

    return accumulator;
  }, {} as Record<A, string>);
};
