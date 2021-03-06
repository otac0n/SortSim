var operations = [];

var SortAlgorithms = {};

ArrayPointer = (function () {
    function ArrayPointer(name, value, array) {
        this.id = operations.length;
        this.name = name;
        this.value = value;
        this.array = array;
        operations.push({ op: "pointer.create", id: this.id, name: name, value: this.value, array: array.id });
    }

    ArrayPointer.prototype.add = function add(v) {
        return this.set(this.value + v);
    };

    ArrayPointer.prototype.sub = function sub(v) {
        return this.set(this.value - v);
    };

    ArrayPointer.prototype.set = function set(v) {
        if (v instanceof ArrayPointer) {
            if (this.array !== v.array) {
                this.array = v.array;
                operations.push({ op: "pointer.parent", id: this.id, array: this.array.id });
            }
            this.value = v.value;
        } else {
            this.value = v;
        }

        operations.push({ op: "pointer.set", id: this.id, value: this.value });
        return this;
    };

    ArrayPointer.prototype.assign = function assign(v) {
        this.array.set(this, v);
    };

    ArrayPointer.prototype.clone = function clone(name) {
        return new ArrayPointer(name, this.value, this.array);
    };

    ArrayPointer.prototype.destroy = function destroy() {
        operations.push({ op: "pointer.destroy", id: this.id });
    };

    ArrayPointer.assignAndIncrement = function assignAndIncrement(a, b) {
        a.assign(b);
        a.add(1);
        b.add(1);
    };

    ArrayPointer.assignAndDecrement = function assignAndDecrement(a, b) {
        a.assign(b);
        a.sub(1);
        b.sub(1);
    };

    return ArrayPointer;
})();

SortArray = (function () {
    function SortArray(length, value) {
        this.id = operations.length;
        this.length = length;

        if (value instanceof Array) {
            this.storage = value.slice();
            this.storage.length = length;
            operations.push({ op: "array.create", id: this.id, length: length, value: this.storage.slice() });
        } else {
            operations.push({ op: "array.create", id: this.id, length: length });
            this.storage = [];
            this.storage.length = length;
            for (var i = 0; i < length; i++) {
                this.storage[i] = null;
            }
        }
    }

    function toIndex(self, i) {
        if (i instanceof ArrayPointer) {
            if (i.array !== self) {
                throw new Error("Attempt to access array with pointer from other array.");
            }

            return i.value;
        } else {
            return i;
        }
    }

    SortArray.prototype.get = function get(i) {
        i = toIndex(this, i);
        return this.storage[i];
    };

    SortArray.prototype.set = function set(i, v) {
        i = toIndex(this, i);
        v = v instanceof ArrayPointer ? v.array.get(v.value) : v;
        operations.push({ op: "array.set", id: this.id, index: i, value: v });
        this.storage[i] = v;
    };

    SortArray.prototype.compare = function compare(i, j) {
        return SortArray.compare(this, i, this, j);
    };

    SortArray.prototype.swap = function swap() {
        if (arguments.length < 2) {
            return;
        }

        var pairs = [];
        for (var i = 0; i < arguments.length; i++) {
            pairs.push(this);
            pairs.push(arguments[i]);
        }

        SortArray.swap.apply(undefined, pairs);
    };

    SortArray.prototype.destroy = function destroy() {
        operations.push({ op: "array.destroy", id: this.id });
        delete this.id;
        delete this.storage;
        delete this.length;
    };

    SortArray.prototype.pointer = function pointer(name, value) {
        return new ArrayPointer(name, value instanceof ArrayPointer ? value.value : (value || 0), this);
    }

    SortArray.create = function create(lengthOrArray) {
        if (lengthOrArray instanceof Array) {
            return new SortArray(lengthOrArray.length, lengthOrArray);
        } else {
            return new SortArray(lengthOrArray | 0);
        }
    }

    SortArray.compare = function compare(a, i, b, j) {
        i = toIndex(a, i);
        j = toIndex(b, j);
        operations.push({ op: "array.compare", idA: a.id, indexA: i, idB: b.id, indexB: j });

        return a.storage[i] > b.storage[j] ? +1
             : a.storage[i] < b.storage[j] ? -1
             : 0;
    };

    SortArray.swap = function swap() {
        if (arguments.length < 4 || arguments.length % 2 != 0) {
            return;
        }

        var elements = [];
        var arrays = [];
        for (var i = 0; i < arguments.length; i += 2) {
            var self = arguments[i];
            var index = arguments[i + 1];
            index = index instanceof ArrayPointer ? index.value : index;
            arrays.push(self);
            elements.push({ id: self.id, index: index });
        }

        operations.push({ op: "array.swap", elements: elements });

        var firstValue;
        for (var i = 0; i < elements.length; i++) {
            var target = arrays[i];
            if (i == 0) {
                firstValue = target.storage[elements[i].index];
            }

            var sourceValue;
            if (i < elements.length - 1) {
                var source = arrays[i + 1];
                sourceValue = source.storage[elements[i + 1].index];
            } else {
                sourceValue = firstValue;
            }

            target.storage[elements[i].index] = sourceValue;
        }
    };

    SortArray.memcpy = function memcpy(dst, src, num) {
        dst = dst instanceof SortArray ? dst.pointer("dst") : dst.clone("dst");
        src = src instanceof SortArray ? src.pointer("src") : src.clone("src");
        for (; num > 0; num--) {
            ArrayPointer.assignAndIncrement(dst, src);
        }
        src.destroy();
        dst.destroy();
    };

    return SortArray;
})();
