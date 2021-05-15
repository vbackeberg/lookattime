export default class NoImageIdStoredError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
// TODO Rename to image Id created