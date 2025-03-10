export type AttributeSet = {
    id: string;
    name: string;
    type: 'text' | 'swatch';
    items: Attribute[];
};

export type Attribute = {
    id: string;
    displayValue: string;
    value?: string;
};
