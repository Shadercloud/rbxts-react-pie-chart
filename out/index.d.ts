import React from "@rbxts/react";
type PieValue = {
    color: Color3;
    size: number;
    label?: string;
};
interface PieProps {
    key?: string;
    Size?: UDim2;
    Position?: UDim2;
    AnchorPoint?: Vector2;
    Values: PieValue[];
    BackgroundTransparency?: number;
    BackgroundColor3?: Color3;
    LabelDistance?: number;
    LabelFontSize?: Enum.FontSize;
    LabelBackgroundColor3?: Color3;
    LabelHoverOnly?: boolean;
    LabelHidden?: boolean;
    HoverDarken?: number;
    onChangeSelected?: (index: number, value?: PieValue) => void;
    onClick?: (index: number, value: PieValue) => void;
}
export declare function Pie(props: PieProps): React.JSX.Element;
export {};
