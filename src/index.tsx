import React, { useState } from "@rbxts/react";
import { GuiService } from "@rbxts/services";
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

type Section = "Top" | "Bottom" | "Left" | "Right";

function Segment(props: { section: Section; color: Color3; fill: number }) {
	const sizeX = props.section === "Left" || props.section === "Right" ? 0.5 : 1;
	const sizeY = props.section === "Left" || props.section === "Right" ? 1 : 0.5;
	let anchor = new Vector2(1, 0.5);
	let zeroed = 0;
	if (props.section === "Right") {
		zeroed = 180;
		anchor = new Vector2(0, 0.5);
	} else if (props.section === "Top") {
		zeroed = 90;
		anchor = new Vector2(0.5, 1);
	} else if (props.section === "Bottom") {
		zeroed = 270;
		anchor = new Vector2(0.5, 0);
	}

	return (
		<frame
			Size={UDim2.fromScale(sizeX, sizeY)}
			AnchorPoint={anchor}
			Position={UDim2.fromScale(0.5, 0.5)}
			ClipsDescendants
			BorderSizePixel={0}
			BackgroundTransparency={1}
			BackgroundColor3={Color3.fromHex("#FFFFFF")}
		>
			<frame
				BackgroundColor3={props.color}
				Size={UDim2.fromScale(sizeX === 1 ? 1 : 2, sizeY === 1 ? 1 : 2)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(anchor.X, anchor.Y)}
			>
				<uicorner CornerRadius={new UDim(0.5, 0)} />
				<uigradient
					Transparency={
						new NumberSequence([
							new NumberSequenceKeypoint(0, 1),
							new NumberSequenceKeypoint(0.4999, 1),
							new NumberSequenceKeypoint(0.5, 0),
							new NumberSequenceKeypoint(1, 0),
						])
					}
					Rotation={zeroed + props.fill * 180}
				/>
			</frame>

		</frame>
	);
}

function getCirclePosition(normalized: number, radius: number = 0.3): UDim2 {
	const centerX = 0.5;
	const centerY = 0.5;

	// Convert 0 → 1 into radians (0 → 2π)
	const angle = normalized * math.pi * 2 + math.pi;

	const x = centerX + math.cos(angle) * radius;
	const y = centerY + math.sin(angle) * radius;

	return UDim2.fromScale(x, y);
}

export function Pie(props: PieProps) {
	const [state, setState] = useState({
		hover: -1
	});

	const changeHover = (index: number): void => {
		if (state.hover === index) return
		setState({ hover: index })
		props.onChangeSelected?.(index, index >= 0 ? props.Values[index] : undefined)
	}

	const segments: React.Element[] = [];
	const labels: React.Element[] = [];
	const totalValue = props.Values.reduce((sum, obj) => sum + obj.size, 0);
	let section: Section = "Top";
	let sectionRemaining: number = 1;
	let totalPercent = 0
	props.Values.forEach((v: PieValue, index: number) => {
		const percent = v.size / totalValue;

		totalPercent += (percent / 2)

		const fill = percent * 2;
		let color = v.color
		if (index === state.hover) {
			const d = props.HoverDarken ?? 0.2
			color = color.Lerp((d < 0 ? new Color3(1, 1, 1) : new Color3(0, 0, 0)), math.abs(d))
		}

		segments.push(<Segment section={section} color={color} fill={-sectionRemaining} />);
		sectionRemaining -= fill;
		if (sectionRemaining <= 0) {
			section = "Bottom";
			if (sectionRemaining < 0)
				segments.push(<Segment section={section} color={color} fill={-sectionRemaining} />);
			sectionRemaining = 1 + sectionRemaining;
		}
		if (!props.LabelHidden && v.label && (!props.LabelHoverOnly || state.hover === index)) {
			labels.push(<textlabel
				Text={v.label}
				Size={UDim2.fromScale(0, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={props.Values.size() === 1 ? UDim2.fromScale(0.5, 0.5) : getCirclePosition(totalPercent, props.LabelDistance)}
				AutomaticSize={Enum.AutomaticSize.XY}
				BackgroundColor3={(props.LabelBackgroundColor3 ?? new Color3(1, 1, 1))}
				FontSize={props.LabelFontSize ?? Enum.FontSize.Size18}
			>
				<uicorner CornerRadius={new UDim(0, 4)} />
				<uipadding
					PaddingLeft={new UDim(0, 5)}
					PaddingRight={new UDim(0, 5)}
					PaddingTop={new UDim(0, 5)}
					PaddingBottom={new UDim(0, 5)}
				/>
				<uistroke Thickness={2}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				/>
			</textlabel>)
		}
		totalPercent += (percent / 2)

	});

	return (
		<frame
			BackgroundTransparency={props.BackgroundTransparency ?? 1}
			BackgroundColor3={props.BackgroundColor3}
			Size={props.Size}
			AnchorPoint={props.AnchorPoint}
			Position={props.Position}
			Event={{
				MouseLeave: () => {
					changeHover(-1)
				},
				InputEnded: (rbx: Frame, input: InputObject): void => {
					if (input.UserInputType !== Enum.UserInputType.MouseButton1) return
					if (state.hover < 0) return

					props.onClick?.(state.hover, props.Values[state.hover])
				},
				MouseMoved: (rbx: Frame, x: number, y: number): void => {
					const [offset] = GuiService.GetGuiInset()
					const localX = x - rbx.AbsolutePosition.X;
					const localY = y - rbx.AbsolutePosition.Y - offset.Y;

					const width = rbx.AbsoluteSize.X;
					const height = rbx.AbsoluteSize.Y;

					const centerX = width / 2;
					const centerY = height / 2;

					const dx = localX - centerX;
					const dy = localY - centerY;

					const radius = math.min(width, height) / 2;

					const distance = math.sqrt(dx * dx + dy * dy);

					if (distance > radius) {
						changeHover(-1)
						return;
					}

					let angle = math.atan2(dy, dx); // -π → π

					if (angle < 0) {
						angle += math.pi * 2;
					}

					let normalized = angle / (math.pi * 2);
					normalized = (normalized + 0.5) % 1;

					let running = 0;


					for (let i = 0; i < props.Values.size(); i++) {
						const percent = props.Values[i].size / totalValue;

						if (normalized >= running && normalized <= running + percent) {
							changeHover(i)
							return;
						}

						running += percent;
					}

					changeHover(-1)
				}
			}}
		>
			{segments}
			{labels}
		</frame>
	);
}
