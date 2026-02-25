-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local React = _react
local useState = _react.useState
local function Segment(props)
	local sizeX = if props.section == "Left" or props.section == "Right" then 0.5 else 1
	local sizeY = if props.section == "Left" or props.section == "Right" then 1 else 0.5
	local anchor = Vector2.new(1, 0.5)
	local zeroed = 0
	if props.section == "Right" then
		zeroed = 180
		anchor = Vector2.new(0, 0.5)
	elseif props.section == "Top" then
		zeroed = 90
		anchor = Vector2.new(0.5, 1)
	elseif props.section == "Bottom" then
		zeroed = 270
		anchor = Vector2.new(0.5, 0)
	end
	return React.createElement("frame", {
		Size = UDim2.fromScale(sizeX, sizeY),
		AnchorPoint = anchor,
		Position = UDim2.fromScale(0.5, 0.5),
		ClipsDescendants = true,
		BorderSizePixel = 0,
		BackgroundTransparency = 1,
		BackgroundColor3 = Color3.fromHex("#FFFFFF"),
	}, React.createElement("frame", {
		BackgroundColor3 = props.color,
		Size = UDim2.fromScale(if sizeX == 1 then 1 else 2, if sizeY == 1 then 1 else 2),
		AnchorPoint = Vector2.new(0.5, 0.5),
		BorderSizePixel = 0,
		Position = UDim2.fromScale(anchor.X, anchor.Y),
	}, React.createElement("uicorner", {
		CornerRadius = UDim.new(0.5, 0),
	}), React.createElement("uigradient", {
		Transparency = NumberSequence.new({ NumberSequenceKeypoint.new(0, 1), NumberSequenceKeypoint.new(0.4999, 1), NumberSequenceKeypoint.new(0.5, 0), NumberSequenceKeypoint.new(1, 0) }),
		Rotation = zeroed + props.fill * 180,
	})))
end
local function getCirclePosition(normalized, radius)
	if radius == nil then
		radius = 0.3
	end
	local centerX = 0.5
	local centerY = 0.5
	-- Convert 0 → 1 into radians (0 → 2π)
	local angle = normalized * math.pi * 2 + math.pi
	local x = centerX + math.cos(angle) * radius
	local y = centerY + math.sin(angle) * radius
	return UDim2.fromScale(x, y)
end
local function Pie(props)
	local state, setState = useState({
		hover = -1,
	})
	local changeHover = function(index)
		if state.hover == index then
			return nil
		end
		setState({
			hover = index,
		})
		local _result = props.onChangeSelected
		if _result ~= nil then
			_result(index, if index >= 0 then props.Values[index + 1] else nil)
		end
	end
	local segments = {}
	local labels = {}
	local _exp = props.Values
	-- ▼ ReadonlyArray.reduce ▼
	local _result = 0
	local _callback = function(sum, obj)
		return sum + obj.size
	end
	for _i = 1, #_exp do
		_result = _callback(_result, _exp[_i], _i - 1, _exp)
	end
	-- ▲ ReadonlyArray.reduce ▲
	local totalValue = _result
	local section = "Top"
	local sectionRemaining = 1
	local totalPercent = 0
	local _exp_1 = props.Values
	-- ▼ ReadonlyArray.forEach ▼
	local _callback_1 = function(v, index)
		local percent = v.size / totalValue
		totalPercent += (percent / 2)
		local fill = percent * 2
		local color = v.color
		if index == state.hover then
			local _condition = props.HoverDarken
			if _condition == nil then
				_condition = 0.2
			end
			local d = _condition
			color = color:Lerp((if d < 0 then Color3.new(1, 1, 1) else Color3.new(0, 0, 0)), math.abs(d))
		end
		local _arg0 = React.createElement(Segment, {
			section = section,
			color = color,
			fill = -sectionRemaining,
		})
		table.insert(segments, _arg0)
		sectionRemaining -= fill
		if sectionRemaining <= 0 then
			section = "Bottom"
			if sectionRemaining < 0 then
				local _arg0_1 = React.createElement(Segment, {
					section = section,
					color = color,
					fill = -sectionRemaining,
				})
				table.insert(segments, _arg0_1)
			end
			sectionRemaining = 1 + sectionRemaining
		end
		local _condition = not props.LabelHidden
		if _condition then
			_condition = v.label
			if _condition ~= "" and _condition then
				_condition = (not props.LabelHoverOnly or state.hover == index)
			end
		end
		if _condition ~= "" and _condition then
			local _arg0_1 = React.createElement("textlabel", {
				Text = v.label,
				Size = UDim2.fromScale(0, 0),
				AnchorPoint = Vector2.new(0.5, 0.5),
				Position = if #props.Values == 1 then UDim2.fromScale(0.5, 0.5) else getCirclePosition(totalPercent, props.LabelDistance),
				AutomaticSize = Enum.AutomaticSize.XY,
				BackgroundColor3 = (props.LabelBackgroundColor3 or Color3.new(1, 1, 1)),
				FontSize = props.LabelFontSize or Enum.FontSize.Size18,
			}, React.createElement("uicorner", {
				CornerRadius = UDim.new(0, 4),
			}), React.createElement("uipadding", {
				PaddingLeft = UDim.new(0, 5),
				PaddingRight = UDim.new(0, 5),
				PaddingTop = UDim.new(0, 5),
				PaddingBottom = UDim.new(0, 5),
			}), React.createElement("uistroke", {
				Thickness = 2,
				ApplyStrokeMode = Enum.ApplyStrokeMode.Border,
			}))
			table.insert(labels, _arg0_1)
		end
		totalPercent += (percent / 2)
	end
	for _k, _v in _exp_1 do
		_callback_1(_v, _k - 1, _exp_1)
	end
	-- ▲ ReadonlyArray.forEach ▲
	local _attributes = {}
	local _condition = props.BackgroundTransparency
	if _condition == nil then
		_condition = 1
	end
	_attributes.BackgroundTransparency = _condition
	_attributes.BackgroundColor3 = props.BackgroundColor3
	_attributes.Size = props.Size
	_attributes.AnchorPoint = props.AnchorPoint
	_attributes.Position = props.Position
	_attributes.Event = {
		InputEnded = function(rbx, input)
			if input.UserInputType ~= Enum.UserInputType.MouseButton1 then
				return nil
			end
			if state.hover < 0 then
				return nil
			end
			local _result_1 = props.onClick
			if _result_1 ~= nil then
				_result_1(state.hover, props.Values[state.hover + 1])
			end
		end,
		MouseMoved = function(rbx, x, y)
			local localX = x - rbx.AbsolutePosition.X
			local localY = y - rbx.AbsolutePosition.Y
			local width = rbx.AbsoluteSize.X
			local height = rbx.AbsoluteSize.Y
			local centerX = width / 2
			local centerY = height / 2
			local dx = localX - centerX
			local dy = localY - centerY
			local radius = math.min(width, height) / 2
			local distance = math.sqrt(dx * dx + dy * dy)
			if distance > radius then
				changeHover(-1)
				return nil
			end
			local angle = math.atan2(dy, dx)
			if angle < 0 then
				angle += math.pi * 2
			end
			local normalized = angle / (math.pi * 2)
			normalized = (normalized + 0.5) % 1
			local running = 0
			for i = 0, #props.Values - 1 do
				local percent = props.Values[i + 1].size / totalValue
				if normalized >= running and normalized <= running + percent then
					changeHover(i)
					return nil
				end
				running += percent
			end
			changeHover(-1)
		end,
	}
	return React.createElement("frame", _attributes, segments, labels)
end
return {
	Pie = Pie,
}
