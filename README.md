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
    Values={[
        {color: Color3.fromHex("#FF0000"), size: 30},
        {color: Color3.fromHex("#00FF00"), size: 40},
        {color: Color3.fromHex("#FFFF00"), size: 50},
        {color: Color3.fromHex("#0000FF"), size: 30}
    ]}
/>
```

## Preview Screenshot
  ![Preview](/screenshot.png)