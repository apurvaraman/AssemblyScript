@no_implicit_malloc()
export class Array<T> implements IDisposable {
  readonly length: int;

  constructor(arrayLength: int) {

    // if the argument is any other number, a RangeError exception is thrown
    if (arrayLength < 0)
      unreachable();

    const elementsByteSize: uintptr = (arrayLength as uintptr) * sizeof<T>();
    const ptr: uintptr = malloc(4 + elementsByteSize);

    unsafe_cast<uintptr,ArrayStruct>(ptr).length = arrayLength;
    memset(ptr + 4, 0, elementsByteSize);

    return unsafe_cast<uintptr,this>(ptr);
  }

  indexOf(searchElement: T, fromIndex: int = 0): int {
    const length: int = this.length;

    // if negative, it is taken as the offset from the end of the array
    if (fromIndex < 0) {
      fromIndex = length + fromIndex;

      // if the calculated index is less than 0, then the whole array will be searched
      if (fromIndex < 0)
        fromIndex = 0;
    }

    // implicit: if greater than or equal to the array's length, -1 is returned
    while (fromIndex < length) {
      if (this[fromIndex] == searchElement)
        return fromIndex;
      ++fromIndex;
    }

    return -1;
  }

  lastIndexOf(searchElement: T, fromIndex: int = 0x7fffffff): int {
    const length: int = this.length;

     // if negative, it is taken as the offset from the end of the array
    if (fromIndex < 0)
      fromIndex = length + fromIndex;

    // if greater than or equal to the length of the array, the whole array will be searched
    else if (fromIndex >= length)
      fromIndex = length - 1;

    // implicit: if the calculated index is less than 0, -1 is returned
    while (fromIndex >= 0) {
      if (this[fromIndex] == searchElement)
        return fromIndex;
      --fromIndex;
    }
    return -1;
  }

  slice(begin: int = 0, end: int = 0x7fffffff): this {
    const length: int = this.length;

    if (begin < 0) {
      begin = length + begin;
      if (begin < 0)
        begin = 0;
    } else if (begin > length)
      begin = length;

    if (end < 0)
      end = length + end;
    else if (end > length)
      end = length;

    if (end < begin)
      end = begin;

    const arrayLength: int = end - begin;
    const elementsByteSize: uintptr = (arrayLength as uintptr) * sizeof<T>();
    const ptr: uintptr = malloc(4 + elementsByteSize);

    unsafe_cast<uintptr,ArrayStruct>(ptr).length = arrayLength;
    memcpy(ptr + 4, unsafe_cast<this,uintptr>(this) + 4 + begin * sizeof<T>(), elementsByteSize);

    return unsafe_cast<uintptr,this>(ptr);
  }

  reverse(): this {
    // transposes the elements of the calling array object in place, mutating the array
    for (let i: int = 0, j: int = this.length - 1, t: int; i < j; ++i, --j) {
      t = this[i];
      this[i] = this[j];
      this[j] = t;
    }

    // and returning a reference to the array
    return this;
  }

  dispose(): void {
    free(unsafe_cast<this,uintptr>(this));
  }
}

// transient helper struct used to set the otherwise readonly length property
class ArrayStruct {
  length: int;
}
