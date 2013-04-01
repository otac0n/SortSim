function GnomeSort(values) {
    var i = values.pointer("i", 1);
    while (i.value < values.length) {
        if (values.compare(i, i.value - 1) >= 0) {
            i.add(1);
        } else {
            values.swap(i, i.value - 1);
            if (i.value > 1) {
                i.sub(1);
            }
        }
    }
    i.destroy();
}

if (SortAlgorithms) {
    SortAlgorithms["GnomeSort"] = { name: "Gnome sort", sort: GnomeSort };
}
