export abstract class Array<T> implements IDisposable {
  readonly length: int;

  indexOf(searchElement: T, fromIndex: int = 0): int {
    const length: int = this.length;
    if (fromIndex < 0) { // if negative, it is taken as the offset from the end of the array
      fromIndex = length + fromIndex;
      if (fromIndex < 0) // if the calculated index is less than 0, then the whole array will be searched
        fromIndex = 0;
    }
    while (fromIndex < length) { // if greater than or equal to the array's length, -1 is returned
      if (this[fromIndex] == searchElement)
        return fromIndex;
      ++fromIndex;
    }
    return -1;
  }

  lastIndexOf(searchElement: T, fromIndex: int = -1): int {
    const length: int = this.length;
    if (fromIndex < 0) // if negative, it is taken as the offset from the end of the array
      fromIndex = length + fromIndex;
    else if (fromIndex >= length) // if greater than or equal to the length of the array, the whole array will be searched
      fromIndex = length - 1;
    while (fromIndex >= 0) { // if the calculated index is less than 0, -1 is returned
      if (this[fromIndex] == searchElement)
        return fromIndex;
      --fromIndex;
    }
    return -1;
  }

/*
  slice(begin: int = 0, end: int = this.length): Array<T> {
    const length: int = this.length;
    if (begin < 0) {
      begin = length + begin;
      if (begin < 0)
        begin = 0;
    } else if (begin > length)
      begin = length;
    if (end < 0)
      end = length + end;
    if (end < begin)
      end = begin;
    // TODO: Creating the slice requires malloc
  }
*/

  reverse(): this {
    // transposes the elements of the calling array object in place, mutating the array
    let t: T, i: int = 0, j: int = this.length - 1;
    while (i < j) {
      t = this[i];
      this[i] = this[j];
      this[j] = t;
      ++i;
      --j;
    }
    return this; // and returning a reference to the array
  }

  abstract dispose(): void;
}
