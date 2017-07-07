export abstract class Disposable implements IDisposable {

  dispose(): void {
    free(unsafe_cast<this,uintptr>(this));
  }

}
