var operations = [];

function ArrayPointer(name, value, array) {
    this.id = operations.length;
    this.name = name;
    this.value = value;
    this.array = array;
    operations.push({ op: "pointer.create", id: this.id, name: name, value: this.value, array: array.id });

    this.add = function add(v) {
        this.set(this.value + v);
    };

    this.sub = function add(v) {
        this.set(this.value - v);
    };

    this.set = function set(v) {
        this.value = v instanceof ArrayPointer ? v.value : v;
        operations.push({ op: "pointer.set", id: this.id, value: this.value });
    };

    this.destroy = function destroy() {
        operations.push({ op: "pointer.destroy", id: this.id });
    };
}

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

    this.get = function get(i) {
        i = i instanceof ArrayPointer ? i.value : i;
        return this.storage[i];
    };

    this.set = function set(i, v) {
        i = i instanceof ArrayPointer ? i.value : i;
        operations.push({ op: "array.set", id: this.id, index: i, value: v });
        this.storage[i] = v;
    };

    this.compare = function compare(i, j) {
        return SortArray.compare(this, i, this, j);
    }

    this.swap = function swap(i, j) {
        SortArray.swap(this, i, this, j);
    };

    this.destroy = function destroy() {
        operations.push({ op: "array.destroy", id: this.id });
        delete this.id;
        delete this.storage;
        delete this.length;
    };

    this.pointer = function pointer(name, value) {
        return new ArrayPointer(name, value instanceof ArrayPointer ? value.value : (value || 0), this);
    }
}

SortArray.create = function (length, fill) {
    var array = [];
    array.length = length;

    for (var i = length - 1; i >= 0; i--) {
        array[i] = fill(i);
    }

    return new SortArray(array.length, array);
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
