export class String extends Array<ushort> {

  indexOfString(value: string): int { // FIXME: any way to overload this?
    if (value.length > this.length)
      return -1;
    const thisPtr: uintptr = unsafe_cast<String,uintptr>(this) + sizeof<Array<ushort>>();
    const valuePtr: uintptr = unsafe_cast<string,uintptr>(value) + sizeof<Array<ushort>>();
    const limitPtr: uintptr = this.length - value.length;
    for (let offsetPtr: uintptr = 0; offsetPtr < limitPtr; offsetPtr += sizeof<ushort>())
      if (memcmp(thisPtr + offsetPtr, valuePtr, value.length) == 0)
        return offsetPtr as int;
    return -1;
  }

  startsWith(value: string): bool {
    if (value.length > this.length)
      return false;
    const thisPtr: uintptr = unsafe_cast<String,uintptr>(this) + sizeof<Array<ushort>>();
    const valuePtr: uintptr = unsafe_cast<string,uintptr>(value) + sizeof<Array<ushort>>();
    return memcmp(thisPtr, valuePtr, value.length << 1) == 0;
  }

  endsWith(value: string): bool {
    if (value.length > this.length)
      return false;
    const thisPtr: uintptr = unsafe_cast<String,uintptr>(this) + sizeof<Array<ushort>>();
    const valuePtr: uintptr = unsafe_cast<string,uintptr>(value) + sizeof<Array<ushort>>();
    return memcmp(thisPtr + (this.length - value.length) << 1, valuePtr, value.length) == 0;
  }
}
