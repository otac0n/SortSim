function RenderSimple(operations, sync, target) {
    var frame = 0;
    var $parent = $('<div class="simple" />').appendTo(target);

    var renderOperation = function () {
        if (sync.stop || frame >= operations.length) {
            return false;
        }

        var op = operations[frame++];

        var animations = 0;
        var animationFinish = function () {
            a = --animations;
            if (a == 0) {
                RenderFrame();
            }
        };

        switch (op.op) {
            case "array.create":
                $div = $('<div class="array" />').addClass('array' + op.id).appendTo($parent);
                for (var i = 0; i < op.length; i++) {
                    $element = $('<div class="element" />').append($('<span class="value" />')).appendTo($div);
                    $element.find('.value').text(op.value ? op.value[i] : "\xB7");
                }
                break;
            case "array.set":
                $parent.find('.array' + op.id).find('.element').eq(op.index).find('.value').text(op.value === null ? "\xB7" : op.value);
                break;
            case "array.destroy":
                $parent.find('.array' + op.id).remove();
                break;
            case "array.compare":
                $parent.find('.array' + op.idA).find('.element').eq(op.indexA).css({ backgroundColor: '#fff' })
                    .animate({ backgroundColor: '#ff0' }, 400/sync.speed, function () {
                        $(this).animate({ backgroundColor: '#fff' }, 400/sync.speed, function () {
                            animationFinish();
                        });
                    });
                $parent.find('.array' + op.idB).find('.element').eq(op.indexB).css({ backgroundColor: '#fff' })
                    .animate({ backgroundColor: '#ff0' }, 400/sync.speed, function () {
                        $(this).animate({ backgroundColor: '#fff' }, 400/sync.speed, function () {
                            animationFinish();
                        });
                    });
                animations = 2;
                break;
            case "array.swap":
                var elements = op.elements;
                var firstValue;
                for (var i = 0; i < elements.length; i++) {
                    var target = elements[i];
                    var $target = $parent.find(".array" + target.id).find('.element').eq(target.index).find('.value');
                    if (i == 0) {
                        firstValue = $target.text();
                    }

                    var sourceValue;
                    if (i < elements.length - 1) {
                        var source = elements[i + 1];
                        var $source = $parent.find(".array" + source.id).find('.element').eq(source.index).find('.value');
                        sourceValue = $source.text();
                    } else {
                        sourceValue = firstValue;
                    }

                    $target.text(sourceValue);
                }
                break;
            case "pointer.create":
                $('<i class="pointer" />').addClass('pointer' + op.id).text(op.name).appendTo($parent.find('.array' + op.array).find('.element').eq(op.value));
                break;
            case "pointer.set":
                $parent.find('.pointer' + op.id).appendTo($parent.find('.pointer' + op.id).parents('.array').find('.element').eq(op.value));
                break;
            case "pointer.destroy":
                $parent.find('.pointer' + op.id).remove();
                break;
        }

        return animations == 0;
    }

    function RenderFrame() {
        while (renderOperation()) {}
    }

    RenderFrame();
}
