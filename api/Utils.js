export const formatNumber = (num) => num.toString().length < 2 ? `0${num}` : num

export const uniqueID = () =>
	Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
