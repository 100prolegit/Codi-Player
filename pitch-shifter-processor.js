class PitchShifterProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{
      name: "semitones",
      defaultValue: 0,
      minValue: -12,
      maxValue: 12,
      automationRate: "k-rate"
    }];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const semitones = parameters.semitones[0];
    const pitchRatio = Math.pow(2, semitones / 12);

    for (let channel = 0; channel < output.length; channel++) {
      const inData = input[channel];
      const outData = output[channel];
      if (!inData || !outData) continue;

      for (let i = 0; i < outData.length; i++) {
        const readIndex = i * pitchRatio;
        const idx = Math.floor(readIndex);
        const frac = readIndex - idx;
        const s1 = inData[idx] || 0;
        const s2 = inData[idx + 1] || 0;
        outData[i] = s1 + (s2 - s1) * frac;
      }
    }
    return true;
  }
}

registerProcessor("pitch-shifter-processor", PitchShifterProcessor);
