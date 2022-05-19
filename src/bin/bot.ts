import { startApp } from '..';

const port = process.env.PORT ?? 5000;
const address = '0.0.0.0';

void startApp().then(app =>
  app.listen(port, address, () => {
    console.log(`Server is running on: http://${address}:${port}`);
  }),
);
