import * as d3 from 'd3';

export function AttrTransition(element, properties: Array<{ attr: string, newValue: any }>, duration: number, delay = 0) {
    const transition = d3.select(({} as string)).transition()
        .delay(delay)
        .duration(duration);

    properties.forEach(p => {
        transition.tween('attr:' + p.attr, () => {
            const currentValue = element.attr(p.attr);
            const i = d3.interpolateString(currentValue, p.newValue);
            return (t) => { element.attr(p.attr, i(t)); };
        });
    });
}
