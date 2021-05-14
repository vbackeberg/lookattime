export default class NoImageBlobStoredError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
