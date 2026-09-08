# Real-Time ML Diagnostics for Solar Mini-Grids

**Node:** 01 · Core · Dissertation
**Status:** ready, needs your review, not blocked on missing info

## One-line

A predictive-maintenance system for off-grid solar installations that catches
failing equipment before it fails, built for the reality of sub-Saharan
Africa, where a technician can't just drive out and check on a mini-grid.

## Problem

Off-grid solar mini-grids across Zimbabwe and the wider region run largely
unmonitored. Faults (partial shading, inverter overload, deep discharge,
dead sensors) surface only after the system has already degraded or failed,
by which point it's a truck-roll and a village without power. Rule-based
threshold alarms exist but generate too many false positives to be trusted,
and there's no accessible, real-time way to tell "normal wear" from
"developing fault" on hardware this cheap and this remote.

## Approach

A five-layer pipeline, containerised end-to-end:

**Edge.** An ESP32 node reads 13 sensor channels a minute: PV/battery
voltage and current, AC power/power factor via a PZEM-004T, solar irradiance
(BH1750), battery temperature (DS18B20), RTC-stamped. On a network outage the
firmware buffers to LittleFS and replays with an `is_offline_buffered` flag
rather than dropping data, the kind of detail that matters when the network
*is* the failure mode you're diagnosing.

**Transport.** MQTTS over TLS 1.2, QoS 1, through an Eclipse Mosquitto
broker, encrypted telemetry even on cheap edge hardware.

**Inference.** A two-stage hierarchical classifier, not a single model:
1. **Isolation Forest** as an unsupervised anomaly gate (trained on 50,000
   normal-operation samples), filtering obvious "normal" before it ever
   reaches the classifier, cutting false-positive rate and CPU load.
2. **Random Forest** as a 5-class fault classifier behind that gate:
   partial shading, inverter overload, deep discharge (IEC 60896-11 cutoff),
   dead sensor, or uncertain-anomaly when confidence drops below 50%.

Tuned via GridSearchCV over 16 hyperparameter combinations, 5-fold CV,
~0.85 F1-weighted on held-out data. Chemistry-aware normalisation (lead-acid,
AGM, lithium, LiFePO4, NMC) derives state-of-charge bounds per battery type
rather than assuming one chemistry.

**Serving.** FastAPI ML engine behind a Node/Express backend, results pushed
to the dashboard over Socket.IO. Weekly APScheduler retraining folds the last
30 days of validated "normal" readings back into the training set and logs
RMSE/MAE per cycle, so the model keeps calibrating itself against the
specific installation it's watching.

**Dashboard.** React + Recharts, live telemetry and fault-alert log with
severity filtering, PDF/Word report export.

## Validation

This is the part most student projects skip: the `evaluation/` module
benchmarks the classifier against a rule-based baseline (Nassar et al.),
reports per-class precision/recall/F1 and confusion matrices, measures MQTT
delivery rate and latency/jitter under injected network-outage conditions,
and cross-checks against **NREL PVDAQ** real-world photovoltaic measurement
data, not just the synthetic training set.

Training data itself is physics-informed, not naively synthetic: a 365-day
Southern-Hemisphere solar profile (Zimbabwe, ~17°S), diurnal temperature
modelling, probabilistic cloud-blocking events, and a battery-ageing model
(Ruetschi 2004, 10%/year capacity loss) with fault-accelerated degradation.

## Stack

ESP32 · MQTTS/Mosquitto · Python · scikit-learn (Random Forest + Isolation
Forest) · FastAPI · Node.js/Express · Socket.IO · MySQL · React · Tailwind ·
Docker Compose · Nginx

## Outcome / where it stands

Final-year dissertation project, First Class. Fully containerised,
Wokwi-simulated hardware-in-the-loop path for development without physical
ESP32 hardware.

## TODO before publishing

- [ ] Final degree classification/grade for this specific module, if you want
      it quoted
- [ ] Any real deployment (even a single pilot site), or is this
      simulation-validated only; phrasing needs to be accurate either way
- [ ] Confirm ~0.85 F1 is the number you want public, or if a more recent run
      changed it
