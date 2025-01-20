const params = {
	moveTickSize: 50,
	videoContainerId: "webgazerVideoContainer",
	videoElementId: "webgazerVideoFeed",
	videoElementCanvasId: "webgazerVideoCanvas",
	faceOverlayId: "webgazerFaceOverlay",
	faceFeedbackBoxId: "webgazerFaceFeedbackBox",
	gazeDotId: "webgazerGazeDot",
	videoViewerWidth: 320,
	videoViewerHeight: 240,
	faceFeedbackBoxRatio: 0.66,
	// View options
	showVideo: true,
	mirrorVideo: true,
	showFaceOverlay: false,
	showFaceFeedbackBox: true,
	showGazeDot: false,
	camConstraints: {
		video: {
			width: { min: 320, ideal: 640, max: 1920 },
			height: { min: 240, ideal: 480, max: 1080 },
			facingMode: "user",
		},
	},
	dataTimestep: 50,
	showVideoPreview: true,
	applyKalmanFilter: true,
	saveDataAcrossSessions: false,
	// Whether or not to store accuracy eigenValues, used by the calibration example file
	storingPoints: false,

	trackEye: "both",
};

export default params;
