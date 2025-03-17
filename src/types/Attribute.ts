export type AttributeSet = {
    id: string;
    name: string;
    type: 'text' | 'swatch';
    items: AttributeItem[];
};

export type AttributeItem = {
    id: string;
    displayValue: string;
    value?: string;
};
