import util from "./util.mjs";
import util_regression from "./util_regression.mjs";
import params from "./params.mjs";

const reg = {};

/**
 * Constructor of RidgeReg object,
 * this object allow to perform ridge regression
 * @constructor
 */
reg.RidgeReg = function () {
	this.init();
};

/**
 * Initialize new arrays and initialize Kalman filter.
 */
reg.RidgeReg.prototype.init = util_regression.InitRegression;

reg.RidgeReg.prototype.getCalibrationData = util_regression.getCalibrationData;

reg.RidgeReg.prototype.clearCalibrationData =
	util_regression.clearCalibrationData;

/**
 * Add given data from eyes
 * @param {Object} eyes - eyes where extract data to add
 * @param {Object} screenPos - The current screen point
 * @param {Object} type - The type of performed action
 */
reg.RidgeReg.prototype.addData = util_regression.addData;

/**
 * Add calibration data from eyes
 * @param {Object} eyes - eyes where extract data to add
 * @param {Object} screenPos - The current screen point
 * @param {Object} type - The type of performed action
 */
reg.RidgeReg.prototype.addCalibrationData = util_regression.addCalibrationData;

/**
 * Train the model using the data
 * @returns {Object}
 */
reg.RidgeReg.prototype.trainModel = function () {
	const screenXArray = this.calibrationScreenXClicksArray.concat(
		this.calibrationScreenXTrailArray
	);
	const screenYArray = this.calibrationScreenYClicksArray.concat(
		this.calibrationScreenYTrailArray
	);
	const eyeFeatures = this.calibrationEyeFeaturesClicks.concat(
		this.calibrationEyeFeaturesTrail
	);

	// console.log({
	// 	screenXArray,
	// 	screenYArray,
	// 	eyeFeatures,
	// });

	const coefficientsX = util_regression.ridge(
		screenXArray,
		eyeFeatures,
		this.ridgeParameter
	);
	const coefficientsY = util_regression.ridge(
		screenYArray,
		eyeFeatures,
		this.ridgeParameter
	);

	this.XWeights = coefficientsX;
	this.YWeights = coefficientsY;

	return {
		XWeights: coefficientsX,
		YWeights: coefficientsY,
	};
};

/**
 * Try to predict coordinates from pupil data using pretrained weights from calibration
 * after apply linear regression on data set
 * @param {Object} eyesObj - The current user eyes object
 * @returns {Object}
 */
reg.RidgeReg.prototype.trainedPredict = function (eyesObj) {
	if (!eyesObj) {
		return null;
	}

	const coefficientsX = this.XWeights;
	const coefficientsY = this.YWeights;

	const eyeFeats = util.getEyeFeats(eyesObj);
	let predictedX = 0;
	for (let i = 0; i < eyeFeats.length; i++) {
		predictedX += eyeFeats[i] * coefficientsX[i];
	}
	let predictedY = 0;
	for (let i = 0; i < eyeFeats.length; i++) {
		predictedY += eyeFeats[i] * coefficientsY[i];
	}

	predictedX = Math.floor(predictedX);
	predictedY = Math.floor(predictedY);

	if (params.applyKalmanFilter) {
		// Update Kalman model, and get prediction
		let newGaze = [predictedX, predictedY]; // [20200607 xk] Should we use a 1x4 vector?
		newGaze = this.kalman.update(newGaze);

		return {
			x: newGaze[0],
			y: newGaze[1],
		};
	} else {
		return {
			x: predictedX,
			y: predictedY,
		};
	}
};

/**
 * Try to predict coordinates from pupil data
 * after apply linear regression on data set
 * @param {Object} eyesObj - The current user eyes object
 * @returns {Object}
 */
reg.RidgeReg.prototype.predict = function (eyesObj) {
	if (!eyesObj || this.eyeFeaturesClicks.length === 0) {
		return null;
	}
	var acceptTime = performance.now() - this.trailTime;
	var trailX = [];
	var trailY = [];
	var trailFeat = [];
	for (var i = 0; i < this.trailDataWindow; i++) {
		if (this.trailTimes.get(i) > acceptTime) {
			trailX.push(this.screenXTrailArray.get(i));
			trailY.push(this.screenYTrailArray.get(i));
			trailFeat.push(this.eyeFeaturesTrail.get(i));
		}
	}

	var screenXArray = this.screenXClicksArray.data.concat(trailX);
	var screenYArray = this.screenYClicksArray.data.concat(trailY);
	var eyeFeatures = this.eyeFeaturesClicks.data.concat(trailFeat);

	// console.log({
	// 	screenXArray: screenXArray,
	// 	screenYArray: screenYArray,
	// 	eyeFeatures: eyeFeatures,
	// });

	var coefficientsX = util_regression.ridge(
		screenXArray,
		eyeFeatures,
		this.ridgeParameter
	);
	var coefficientsY = util_regression.ridge(
		screenYArray,
		eyeFeatures,
		this.ridgeParameter
	);

	var eyeFeats = util.getEyeFeats(eyesObj);
	var predictedX = 0;
	for (var i = 0; i < eyeFeats.length; i++) {
		predictedX += eyeFeats[i] * coefficientsX[i];
	}
	var predictedY = 0;
	for (var i = 0; i < eyeFeats.length; i++) {
		predictedY += eyeFeats[i] * coefficientsY[i];
	}

	predictedX = Math.floor(predictedX);
	predictedY = Math.floor(predictedY);

	if (params.applyKalmanFilter) {
		// Update Kalman model, and get prediction
		var newGaze = [predictedX, predictedY]; // [20200607 xk] Should we use a 1x4 vector?
		newGaze = this.kalman.update(newGaze);

		return {
			x: newGaze[0],
			y: newGaze[1],
		};
	} else {
		return {
			x: predictedX,
			y: predictedY,
		};
	}
};

reg.RidgeReg.prototype.setData = util_regression.setData;

reg.RidgeReg.prototype.setWeights = util_regression.setWeights;

/**
 * Return the data
 * @returns {Array.<Object>|*}
 */
reg.RidgeReg.prototype.getData = function () {
	return this.dataClicks.data;
};

/**
 * The RidgeReg object name
 * @type {string}
 */
reg.RidgeReg.prototype.name = "ridge";

export default reg;
