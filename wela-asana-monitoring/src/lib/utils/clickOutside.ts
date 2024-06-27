export const clickOutside = (
	/** @type {{ contains: (arg0: any) => any; }} */ element: { contains: (arg0: any) => any },
	/** @type {() => void} */ callbackFunction: () => void
) => {
	/**
	 * @param {{ target: any; }} event
	 */
	function onClick(event: { target: any }) {
		if (!element.contains(event.target)) {
			callbackFunction();
		}
	}

	// @ts-ignore
	document.body.addEventListener('click', onClick);

	return {
		/**
		 * @param {() => void} newCallbackFunction
		 */
		update(newCallbackFunction: () => void) {
			callbackFunction = newCallbackFunction;
		},
		destroy() {
			document.body.removeEventListener('click', onClick);
		}
	};
};
