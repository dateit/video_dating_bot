interface IMessage {
  text: string;
}

export const parseCommandArguments = <M extends IMessage, C extends string, A extends string>(
  message: M,
  command: C,
  argumentNames: readonly A[],
) => {
  const _arguments = message.text.replace(`/${command} `, '').split(' ');

  // eslint-disable-next-line unicorn/no-array-reduce
  return argumentNames.reduce((accumulator, argument, index) => {
    accumulator[argument] = _arguments[index];

    return accumulator;
  }, {} as Record<A, string>);
};
