# Modified Webgazer API

- Canvas where Webgazer collects and display data must have

```javascript
<canvas
    id="plotting_canvas">
</canvas>
```

---

# Initializing Webgazer

- Webgazer must be initialized before starting calibration or starting eye tracking else will throw an error if methods are called

```javascript
await webgazer
    .setRegression("ridge")
    .setGazeListener(function (data, clock) {
        if (data == null) {
            return;
        }

        /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
        /* elapsed time in milliseconds since webgazer.begin() was called */

        const {x, y} = data
    })
    .showFaceOverlay(false)
    .showVideoPreview(true)
    .showPredictionPoints(true)
    .initialize();
```

---

# Calibration Page

```javascript
await webgazer
    .setRegression("ridge")
    .showFaceOverlay(false)
    .showVideoPreview(true)
    .showPredictionPoints(false)
    .initialize();
```

## Starting Calibration

```javascript
webgazer.startCalibration();
```

## Stopping Calibration

- Returns
    - startTimestamp = start time of calibration (ms)
    - endTimestamp = end time of calibration (ms)
    - XWeights = weights for regression model
    - YWeights = weights for regression model

```javascript
const { startTimestamp, endTimestamp, XWeights, YWeights } = 
webgazer.stopCalibration();
```

---

# Starting Eye Tracking For Data Collection Page

- setGazeListener accepts callback function to access stream of eye tracking X, Y coordinates and timestamp for data collection

```javascript
await webgazer
    .setRegression("ridge")
    .setGazeListener(function (data, clock) {
        if (data == null) {
            return;
        }

        /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
        /* elapsed time in milliseconds since webgazer.begin() was called */

        const {x, y} = data
    })
    .showFaceOverlay(false) // shows face mesh overlay on webcam
    .showVideoPreview(true) 
    .showPredictionPoints(true) // shows moving dot
    .initialize();
```

## Setting model weights from Calibration and starting the API

```javascript
webgazer
    .setWeights({
        XWeights: ,
        YWeights: ,
    });

webgazer.begin()
```

## Stopping the API

- startTimestamp = start time of API (ms)
- endTimestamp = end time of API (ms)

```javascript
const { startTimestamp, endTimestamp } = webgazer.end();
```
