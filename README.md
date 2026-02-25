# @rbxts/react-pie-chart

Quadrant-based pie chart component for @rbxts/react.

## Installation

npm install @rbxts/react-pie-chart

## Usage

```ts
<Pie
    Size={UDim2.fromOffset(300, 300)}
    AnchorPoint={new Vector2(0.5, 0.5)}
    Position={UDim2.fromScale(0.5, 0.5)}
    LabelDistance={0.3}
    LabelBackgroundColor3={Color3.fromHex("#FFFFFF")}
    LabelFontSize={Enum.FontSize.Size14}
    // LabelHoverOnly
    // LabelHidden
    HoverDarken={0.5}
    Values={[
        { color: Color3.fromHex("#FF0000"), size: 30, label: "Red" },
        { color: Color3.fromHex("#00FF00"), size: 40, label: "Green" },
        { color: Color3.fromHex("#FFFF00"), size: 50, label: "Yellow" },
        { color: Color3.fromHex("#0000FF"), size: 30, label: "Blue" },


    ]}
    onChangeSelected={(index, value) => {

    }}
    onClick={(index, value) => {

    }}
/>
```

## Preview Screenshot
  ![Preview](/screenshot.png)