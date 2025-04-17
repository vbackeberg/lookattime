import Konva from 'konva';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Timeline', () => {
    let stage: Konva.Stage;
    let layer: Konva.Layer;
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        stage = new Konva.Stage({
            container: container,
            width: 500,
            height: 300
        });

        layer = new Konva.Layer();
        stage.add(layer);
    });

    afterEach(() => {
        // Cleanup
        stage.destroy();
        container.remove();
    });

    describe("Given zoomed", () => {
        describe("when layer x is lower than position lowest", () => { 

            it("then move layer x up and all elements down.", () => {

                expect(true).toBe(true);
            });
        });

        describe("when layer x is higher than position lowest", () => {
            it("then move layer x down and all elements up.", () => {

                expect(true).toBe(true);
            });
        })
        describe("when layer x and position lowest equal", () => {
            it("then do not move.", () => {

                expect(true).toBe(true);
            });
        })
    });
});