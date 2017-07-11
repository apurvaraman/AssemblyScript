@no_implicit_malloc()
export class Array<T> extends Disposable {
  readonly capacity: int;
  length: int; // can be any user-provided value

  constructor(capacity: int) {
    super();

    // if the argument is any other number, a RangeError exception is thrown
    if (capacity < 0)
      unreachable();

    const elementsByteSize: uintptr = (capacity as uintptr) * sizeof<T>();
    const ptr: uintptr = malloc(sizeof<ArrayStruct>() + elementsByteSize);
    const struct: ArrayStruct = unsafe_cast<uintptr,ArrayStruct>(ptr);

    struct.capacity = capacity;
    struct.length = capacity;

    memset(ptr + sizeof<ArrayStruct>(), 0, elementsByteSize);

    return unsafe_cast<uintptr,this>(ptr);
  }

  indexOf(searchElement: T, fromIndex: int = 0): int {
    let length: int = this.length;
    if (length > this.capacity)
      length = this.capacity;

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
    let length: int = this.length;
    if (length > this.capacity)
      length = this.capacity;

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
    let length: int = this.length;
    if (length > this.capacity)
      length = this.capacity;

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

    const capacity: int = end - begin;
    const elementsByteSize: uintptr = (capacity as uintptr) * sizeof<T>();
    const ptr: uintptr = malloc(sizeof<ArrayStruct>() + elementsByteSize);

    unsafe_cast<uintptr,ArrayStruct>(ptr).length = capacity;
    memcpy(ptr + sizeof<ArrayStruct>(), unsafe_cast<this,uintptr>(this) + sizeof<ArrayStruct>() + begin * sizeof<T>(), elementsByteSize);

    return unsafe_cast<uintptr,this>(ptr);
  }

  reverse(): this {
    let length: int = this.length;
    if (length > this.capacity)
      length = this.capacity;

    // transposes the elements of the calling array object in place, mutating the array
    for (let i: int = 0, j: int = length - 1, t: int; i < j; ++i, --j) {
      t = this[i];
      this[i] = this[j];
      this[j] = t;
    }

    // and returning a reference to the array
    return this;
  }

  /* unsafeGrow(newCapacity: int): this {
    const oldCapacity: int = this.capacity;
    const length: int = this.length;

    if (newCapacity <= oldCapacity)
      unreachable();

    const oldElementsByteSize: uintptr = (oldCapacity as uintptr) * sizeof<T>();
    const newElementsByteSize: uintptr = (newCapacity as uintptr) * sizeof<T>();
    const ptr: uintptr = malloc(sizeof<ArrayStruct>() + newElementsByteSize);
    const struct: ArrayStruct = unsafe_cast<uintptr,ArrayStruct>(ptr);

    struct.capacity = newCapacity;
    struct.length = length;

    memcpy(ptr + sizeof<ArrayStruct>(), unsafe_cast<this,uintptr>(this) + sizeof<ArrayStruct>(), oldElementsByteSize);
    memset(ptr + sizeof<ArrayStruct>() + oldElementsByteSize, 0, newElementsByteSize - oldElementsByteSize);
    free(unsafe_cast<this,uintptr>(this));

    return unsafe_cast<uintptr,this>(ptr);
  } */
}

// transient helper struct used to set the otherwise readonly length property
class ArrayStruct {
  capacity: int;
  length: int;
}
