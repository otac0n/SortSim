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
        this.set(this.value + v);
    };

    ArrayPointer.prototype.sub = function add(v) {
        this.set(this.value - v);
    };

    ArrayPointer.prototype.set = function set(v) {
        this.value = v instanceof ArrayPointer ? v.value : v;
        operations.push({ op: "pointer.set", id: this.id, value: this.value });
    };

    ArrayPointer.prototype.destroy = function destroy() {
        operations.push({ op: "pointer.destroy", id: this.id });
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
            for (var i = 0; i < this.storage.length; i++) {
                this.storage[i] = null;
            }
        }
    }

    SortArray.prototype.get = function get(i) {
        i = i instanceof ArrayPointer ? i.value : i;
        return this.storage[i];
    };

    SortArray.prototype.set = function set(i, v) {
        i = i instanceof ArrayPointer ? i.value : i;
        operations.push({ op: "array.set", id: this.id, index: i, value: v });
        this.storage[i] = v;
    };

    SortArray.prototype.compare = function compare(i, j) {
        return SortArray.compare(this, i, this, j);
    };

    SortArray.prototype.swap = function swap(i, j) {
        SortArray.swap(this, i, this, j);
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

    SortArray.create = function (lengthOrArray) {
        if (lengthOrArray instanceof Array) {
            return new SortArray(lengthOrArray.length, lengthOrArray);
        } else {
            return new SortArray(lengthOrArray | 0);
        }
    }

    SortArray.compare = function (a, i, b, j) {
        i = i instanceof ArrayPointer ? i.value : i;
        j = j instanceof ArrayPointer ? j.value : j;
        operations.push({ op: "array.compare", idA: a.id, indexA: i, idB: b.id, indexB: j });

        return a.storage[i] > b.storage[j] ? +1
             : a.storage[i] < b.storage[j] ? -1
             : 0;
    };

    SortArray.swap = function (a, i, b, j) {
        i = i instanceof ArrayPointer ? i.value : i;
        j = j instanceof ArrayPointer ? j.value : j;
        operations.push({ op: "array.swap", idA: a.id, indexA: i, idB: b.id, indexB: j });

        var temp = a.storage[i];
        a.storage[i] = b.storage[j];
        b.storage[j] = temp;
    };

    return SortArray;
})();
