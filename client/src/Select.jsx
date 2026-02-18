import { useState, useRef } from "react";
import "./select.css";
import arrowLeft from "./assets/arrow.png";
import arrowRight from "./assets/arrow-right.png";

function Select({ options, icon, onChange, className }) {
	const handleMouseLeave = () => {
		// 1. Check if there is even a selection to scroll to
		if (!selectedOption || selectedOption.value === "") return;

		// 2. Find the selected element strictly within this component instance
		if (containerRef.current) {
			const selectedEl = containerRef.current.querySelector(".option.selected");

			if (selectedEl) {
				selectedEl.scrollIntoView({
					behavior: "smooth",
					block: "nearest", // 'nearest' is usually better for vertical dropdowns
					inline: "center",
				});
			}
		}
	};

	const [selectedOption, setSelectedOption] = useState({
		value: "",
		index: -1,
	});

	const handleArrowClick = (direction) => {
		if (!options || options.length === 0) return;

		let nextIndex = parseInt(selectedOption.index) + direction;

		// Optional: Wrap around logic
		// If you want it to stop at the ends, use:
		if (nextIndex < 0) nextIndex = 0;
		if (nextIndex >= options.length) nextIndex = options.length - 1;

		const nextOption = options[nextIndex];

		setSelectedOption({
			value: nextOption.value,
			index: nextIndex,
		});

		// Trigger the scroll behavior immediately after arrow click
		// We use a small timeout to ensure the DOM has updated the 'selected' class
		setTimeout(handleMouseLeave, 20);

		if (onChange) {
			onChange(nextOption.value);			
		}	
	};

	function handleOptionSelect(e) {
		const newValue = e.currentTarget.dataset.value;
		const newIndex = parseInt(e.currentTarget.dataset.index);

		setSelectedOption({
			value: newValue,
			index: newIndex,
		});

		if (onChange) {
			onChange(newValue);
		}

		setTimeout(handleMouseLeave, 20);
	};

	const containerRef = useRef(null);

	return (
		<>
			<div
				className={`select ${className}`}
				ref={containerRef}
				onMouseLeave={handleMouseLeave}
			>
				{icon ? <img className="icon" src={icon} /> : null}
				<img className="arrow"  src={arrowLeft} onClick={() => handleArrowClick(-1)}/>
				<div className="options-ct">
					{options
						? options.map((option, index) => (
								<span
									data-value={option.value}
									data-index={index}
									key={option.value}
									onClick={handleOptionSelect}
									className={
										selectedOption.value === option.value
											? "option selected"
											: "option"
									}
								>
									{option.label}
								</span>
							))
						: null}
				</div>
				<img className="arrow" src={arrowRight} onClick={() => handleArrowClick(1)}/>
			</div>
		</>
	);
}

export default Select;
