function GnomeSort(values) {
    var emojis = [
        // Robot Face
        //"\uD83E\uDD16",

        // Monkey Face
        "\uD83D\uDC35",

        // Mouse
        "\uD83D\uDC01",

        // Chipmunk
        //"\uD83D\uDC3F",

        // Left Pointing Hand
        "\uD83D\uDC48",

        // Elves
        "\uD83E\uDDDD",
        "\uD83E\uDDDD\uD83C\uDFFB",
        "\uD83E\uDDDD\uD83C\uDFFC",
        "\uD83E\uDDDD\uD83C\uDFFD",
        "\uD83E\uDDDD\uD83C\uDFFE",
        "\uD83E\uDDDD\uD83C\uDFFF",
    ];

    var i = values.pointer(emojis[Math.random() * emojis.length | 0], 1);
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
