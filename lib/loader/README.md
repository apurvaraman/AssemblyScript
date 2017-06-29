AssemblyScript Loader
=====================

[AssemblyScript](https://github.com/dcodeIO/AssemblyScript)'s loader component to run and work with compiled WebAssembly modules, as a stand-alone module.

[![npm](https://img.shields.io/npm/v/assemblyscript-loader.svg)](https://www.npmjs.com/package/assemblyscript-loader)

Usage
-----

```
$> npm install assemblyscript-loader
```

```ts
import load from "assemblyscript-loader"; // JS: var load = require("assemblyscript-loader").load;

load("path/to/module.wasm", {
  imports: {
    ...
  }
}).then(module => {
  ...
  // i.e. call module.exports.main()
});
```

API
---

* **load**(file: `ArrayBuffer | Uint8Array | string`, options: `ILoadOptions`): `Promise<IModule>`<br />
  Loads a WebAssembly module either from a buffer or from a file and returns a promise for an
  `IModule`.

* **ILoadOptions**<br />
  Options to set up the environment created by `load`.

  * **memory**: `WebAssembly.Memory`<br />
    Memory instance to import, if applicable.
  * **imports**: `{ [key: string]: any }`<br />
    Import elements. Usually functions.

* **IModule**<br />
  Common module interface as returned by `load`.

  * **memory**: `WebAssembly.Memory`<br />
    A reference to the underlying memory instance
  * **buffer**: `Uint8Array`<br />
    An unsigned byte view on the underlying memory. Note that this view is updated when memory
    grows, hence make sure to always access it on the module instance directly.
  * **imports**: `{ [key: string]: any }`<br />
    Imported elements. Usually functions.
  * **exports**: `{ [key: string]: any }`<br />
    Exported elements. Usually functions.
  * **currentMemory**(): `number`<br />
    Gets the current size of the memory in 64kb pages.
  * **growMemory**(numPages: `number`): `number`<br />
    Grows the memory by the specified number of 64kb pages.

  Accessors provided for typed memory access:

  * **sbyte** / **s8**: `INumberMemoryAccessor`<br />
    Signed 8-bit integer accessors.
  * **byte** / **u8**: `INumberMemoryAccessor`<br />
    Unsigned 8-bit integer accessors.
  * **short** / **s16**: `INumberMemoryAccessor`<br />
    Signed 16-bit integer accessors.
  * **ushort** / **u16**: `INumberMemoryAccessor`<br />
    Unsigned 16-bit integer accessors.
  * **int** / **s32**: `INumberMemoryAccessor`<br />
    Signed 32-bit integer accessors.
  * **uint** / **u32**: `INumberMemoryAccessor`<br />
    Unsigned 32-bit integer accessors.
  * **long** / **s64**: `ILongMemoryAccessor`<br />
    Signed 64-bit integer accessors.
  * **ulong** / **u64**: `ILongMemoryAccessor`<br />
    Unsigned 64-bit integer accessors.
  * **float** / **f32**: `INumberMemoryAccessor`<br />
    32-bit float accessors.
  * **double** / **f64**: `INumberMemoryAccessor`<br />
    64-bit float accessors.
  * **array**: `IArrayMemoryAccessor`<br />
    Array accessors.
  * **string**: `IStringMemoryAccessor`<br />
    String accessors.

* **INumberMemoryAccessor**<br />
  Number memory accessor.

  * **get**(ptr: `number`): `number`<br />
    Gets a value of the underlying type from memory at the specified pointer.
  * **set**(ptr: `number`, value: `number`): `void`<br />
    Sets a value of the underlying type in memory at the specified pointer.

* **ILongMemoryAccessor**<br />
  Long memory accessor. See also: [long.js](https://github.com/dcodeIO/long.js)

  * **get**(ptr: `number`): `Long`<br />
    Gets a Long from memory at the specified pointer.
  * **set**(ptr: `number`, value: `Long`): `void`<br />
    Sets a Long in memory at the specified pointer.

* **IArrayMemoryAccessor**<br />
  Array memory accessor.

  * **get**(ptr: `number`): `{ length: number, base: number }`<br />
    Gets an array from memory at the specified pointer and returns its length and element base
    pointer.
  * **create**(length: `number`, elementByteSize: `number`): `{ ptr: number, base: number }`<br />
    Creates an array in memory and returns its pointer and element base pointer.

* **IStringMemoryAccessor**<br />
  String memory accessor.

  * **get**(ptr: `number`): `string`<br />
    Gets a string from memory at the specified pointer.
  * **create**(value: `string`): `number`<br />
    Creates a string in memory and returns its pointer.

**Note** that the `create` methods of array and string accessors require an exported or imported
implementation of `malloc`, `free` etc. to be present. Also remember that memory is unmanaged here
and that `free` must be called manually to clean up memory, just like in C. Once WebAssembly
exposes the garbage collector natively, there will be other options as well.

The [long.js](https://github.com/dcodeIO/long.js) dependency can be safely excluded if working with
long/ulong values isn't needed. In this case, the implementation will still accept and produce
Long-like objects having a `low` and a `high` property representing the respective low and high
32-bits.