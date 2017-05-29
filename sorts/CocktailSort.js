function CocktailSort(values) {
    var i = values.pointer("i", 0);
    do {
        var swapped = false;
        for (i.set(0); i.value <= values.length - 2; i.add(1)) {
            if (values.compare(i, i.value + 1) > 0) {
                values.swap(i, i.value + 1);
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
        for (i.set(values.length - 2); i.value >= 0; i.sub(1)) {
            if (values.compare(i, i.value + 1) > 0) {
                values.swap(i, i.value + 1);
                swapped = true;
            }
        }
    } while (swapped);
    i.destroy();
}

function FastCocktailSort(values) {
    var i = values.pointer("i", 0);
    var left = values.pointer("left", 0);
    var right = values.pointer("right", values.length - 2);
    do {
        var swapped = false;
        for (i.set(left); i.value <= right.value; i.add(1)) {
            if (values.compare(i, i.value + 1) > 0) {
                values.swap(i, i.value + 1);
                swapped = true;
            }
        }
        right.sub(1);
        if (!swapped) {
            break;
        }
        for (i.set(right.value); i.value >= left.value; i.sub(1)) {
            if (values.compare(i, i.value + 1) > 0) {
                values.swap(i, i.value + 1);
                swapped = true;
            }
        }
        left.add(1);
    } while (swapped);
    left.destroy();
    right.destroy();
    i.destroy();
}

function OptimizedCocktailSort(values) {
    var i = values.pointer("i", 0);
    var left = values.pointer("left", 0);
    var right = values.pointer("right", values.length - 2);
    var start = values.pointer("start", 0);
    var swapped;
    do {
        swapped = false;
        for (i.set(start.value); i.value <= right.value; i.add(1)) {
            if (values.compare(i, i.value + 1) > 0) {
                values.swap(i, i.value + 1);
                start.set(i.value - 1);
                swapped = true;
            }
        }
        right.sub(1);

        if (swapped == false) break;

        swapped = false;
        for (i.set(start.value); i.value >= left.value; i.sub(1)) {
            if (values.compare(i, i.value + 1) > 0) {
                values.swap(i, i.value + 1);
                start.set(i.value + 1);
                swapped = true;
            }
        }
        left.add(1);
    } while (swapped > 0);
    start.destroy();
    left.destroy();
    right.destroy();
    i.destroy();
}

if (SortAlgorithms) {
    SortAlgorithms["CocktailSort"] = { name: "Cocktail sort", sort: CocktailSort };
    SortAlgorithms["FastCocktailSort"] = { name: "Cocktail sort (fast)", sort: FastCocktailSort };
    SortAlgorithms["OptimizedCocktailSort"] = { name: "Cocktail sort (optimized)", sort: OptimizedCocktailSort };
}
