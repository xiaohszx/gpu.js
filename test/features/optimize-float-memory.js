const { assert, skip, test, module: describe, only } = require('qunit');
const { GPU } = require('../../src');

describe('feature: optimizeFloatMemory');

function whenEnabledCallsCorrectRenderFunction(mode) {
  const gpu = new GPU({ mode });
  const fn = gpu.createKernel(function() { return 1 }, {
    output: [1],
    floatOutput: true,
    optimizeFloatMemory: true,
  });
  let called = false;
  fn.kernel.renderMemoryOptimizedFloat = function() {
    if (called) {
      throw new Error('called again');
    }
    called = true; return [1];
  };
  fn();
  assert.equal(called, true);
}

(GPU.isGPUSupported ? test : skip)('when enabled calls correct render function gpu (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction('gpu');
});
(GPU.isWebGLSupported ? test : skip)('when enabled calls correct render function webgl (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction('webgl');
});
(GPU.isWebGL2Supported ? test : skip)('when enabled calls correct render function webgl2 (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction('webgl2');
});
(GPU.isHeadlessGLSupported ? test : skip)('when enabled calls correct render function headlessgl (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction('headlessgl');
});


function whenEnabledCallsCorrectRenderFunction2D(mode) {
  const gpu = new GPU({ mode });
  const fn = gpu.createKernel(function() { return 1 }, {
    output: [1, 1],
    floatOutput: true,
    optimizeFloatMemory: true,
  });
  let called = false;
  fn.kernel.renderMemoryOptimized2DFloat = function() { called = true; return [[1]]; };
  fn();
  assert.equal(called, true);
}

(GPU.isGPUSupported ? test : skip)('when enabled calls correct render function 2d gpu (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction2D('gpu');
});
(GPU.isWebGLSupported ? test : skip)('when enabled calls correct render function 2d webgl (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction2D('webgl');
});
(GPU.isWebGL2Supported ? test : skip)('when enabled calls correct render function 2d webgl2 (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction2D('webgl2');
});
(GPU.isHeadlessGLSupported ? test : skip)('when enabled calls correct render function 2d headlessgl (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction2D('headlessgl');
});

function whenEnabledCallsCorrectRenderFunction3D(mode) {
  const gpu = new GPU({ mode });
  const fn = gpu.createKernel(function() { return 1 }, {
    output: [1, 1, 1],
    floatOutput: true,
    optimizeFloatMemory: true,
  });
  let called = false;
  fn.kernel.renderMemoryOptimized3DFloat = function() { called = true; return [[[1]]]; };
  fn();
  assert.equal(called, true);
}

(GPU.isGPUSupported ? test : skip)('when enabled calls correct render function 3d gpu (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction3D('gpu');
});
(GPU.isWebGLSupported ? test : skip)('when enabled calls correct render function 3d webgl (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction3D('webgl');
});
(GPU.isWebGL2Supported ? test : skip)('when enabled calls correct render function 3d webgl2 (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction3D('webgl2');
});
(GPU.isHeadlessGLSupported ? test : skip)('when enabled calls correct render function 3d headlessgl (GPU ONLY)', () => {
  whenEnabledCallsCorrectRenderFunction3D('headlessgl');
});

function floatOutput(mode) {
  const gpu = new GPU({ mode });
  const array = [1,2,3,4,5];
  const kernel = gpu.createKernel(function(array) {
    return array[this.thread.x];
  }, {
    output: [5],
    optimizeFloatMemory: true,
    floatOutput: true,
  });
  const result = kernel(array);
  assert.deepEqual(Array.from(result), array);
  gpu.destroy();
}

test('float output auto', () => {
  floatOutput();
});

(GPU.isGPUSupported ? test : skip)('float output gpu', () => {
  floatOutput('gpu');
});

(GPU.isWebGLSupported ? test : skip)('float output webgl', () => {
  floatOutput('webgl');
});

(GPU.isWebGL2Supported ? test : skip)('float output webgl2', () => {
  floatOutput('webgl2');
});

(GPU.isHeadlessGLSupported ? test : skip)('float output headlessgl', () => {
  floatOutput('headlessgl');
});

test('float output cpu', () => {
  floatOutput('cpu');
});


function float2DOutput(mode) {
  const gpu = new GPU({ mode });
  const matrix = [
    [1,2,3,4,5],
    [6,7,8,9,10],
    [11,12,13,14,15],
  ];
  const kernel = gpu.createKernel(function(matrix) {
    return matrix[this.thread.y][this.thread.x];
  }, {
    output: [5, 3],
    optimizeFloatMemory: true,
    floatOutput: true,
  });
  const result = kernel(matrix);
  assert.deepEqual(result.map(row => Array.from(row)), matrix);
  gpu.destroy();
}

test('float 2d output auto', () => {
  float2DOutput();
});

(GPU.isGPUSupported ? test : skip)('float 2d output gpu', () => {
  float2DOutput('gpu');
});

(GPU.isWebGLSupported ? test : skip)('float 2d output webgl', () => {
  float2DOutput('webgl');
});

(GPU.isWebGL2Supported ? test : skip)('float 2d output webgl2', () => {
  float2DOutput('webgl2');
});

(GPU.isHeadlessGLSupported ? test : skip)('float 2d output headlessgl', () => {
  float2DOutput('headlessgl');
});

test('float 2d output cpu', () => {
  float2DOutput('cpu');
});


function float3DOutput(mode) {
  const gpu = new GPU({ mode });
  const cube = [
    [
      [1,2,3,4,5],
      [6,7,8,9,10],
      [11,12,13,14,15],
    ],
    [
      [16,17,18,19,20],
      [21,22,23,24,25],
      [26,27,28,29,30],
    ]
  ];
  const kernel = gpu.createKernel(function(cube) {
    return cube[this.thread.z][this.thread.y][this.thread.x];
  }, {
    output: [5, 3, 2],
    optimizeFloatMemory: true,
    floatOutput: true,
  });
  const result = kernel(cube);
  assert.deepEqual(result.map(matrix => matrix.map(row => Array.from(row))), cube);
  gpu.destroy();
}

test('float 3d output auto', () => {
  float3DOutput();
});

(GPU.isGPUSupported ? test : skip)('float 3d output gpu', () => {
  float3DOutput('gpu');
});

(GPU.isWebGLSupported ? test : skip)('float 3d output webgl', () => {
  float3DOutput('webgl');
});

(GPU.isWebGL2Supported ? test : skip)('float 3d output webgl2', () => {
  float3DOutput('webgl2');
});

(GPU.isHeadlessGLSupported ? test : skip)('float 3d output headlessgl', () => {
  float3DOutput('headlessgl');
});

test('float 3d output cpu', () => {
  float3DOutput('cpu');
});

function floatPipelineOutput(mode) {
  const gpu = new GPU({ mode });
  const array = [1,2,3,4,5];
  const kernel = gpu.createKernel(function(array) {
    return array[this.thread.x];
  }, {
    output: [5],
    optimizeFloatMemory: true,
    floatOutput: true,
    pipeline: true,
  });
  const result = kernel(array).toArray();
  assert.deepEqual(Array.from(result), array);
  gpu.destroy();
}

(GPU.isGPUSupported ? test : skip)('float pipeline output gpu (GPU only)', () => {
  floatPipelineOutput('gpu');
});

(GPU.isWebGLSupported ? test : skip)('float pipeline output webgl (GPU only)', () => {
  floatPipelineOutput('webgl');
});

(GPU.isWebGL2Supported ? test : skip)('float pipeline output webgl2 (GPU only)', () => {
  floatPipelineOutput('webgl2');
});

(GPU.isHeadlessGLSupported ? test : skip)('float pipeline output headlessgl (GPU only)', () => {
  floatPipelineOutput('headlessgl');
});


function floatPipeline2DOutput(mode) {
  const gpu = new GPU({ mode });
  const matrix = [
    [1,2,3,4,5],
    [6,7,8,9,10],
    [11,12,13,14,15],
  ];
  const kernel = gpu.createKernel(function(matrix) {
    return matrix[this.thread.y][this.thread.x];
  }, {
    output: [5, 3],
    optimizeFloatMemory: true,
    floatOutput: true,
    pipeline: true,
  });
  const texture = kernel(matrix);
  const result = texture.toArray();
  console.log(texture.kernel.kernel.compiledFragmentShader);
  assert.deepEqual(result.map(row => Array.from(row)), matrix);
  gpu.destroy();
}


(GPU.isGPUSupported ? test : skip)('float pipeline 2d output gpu (GPU Only)', () => {
  floatPipeline2DOutput('gpu');
});

(GPU.isWebGLSupported ? test : skip)('float pipeline 2d output webgl (GPU Only)', () => {
  floatPipeline2DOutput('webgl');
});

(GPU.isWebGL2Supported ? test : skip)('float pipeline 2d output webgl2 (GPU Only)', () => {
  floatPipeline2DOutput('webgl2');
});

(GPU.isHeadlessGLSupported ? test : skip)('float pipeline 2d output headlessgl (GPU Only)', () => {
  floatPipeline2DOutput('headlessgl');
});


function floatPipeline3DOutput(mode) {
  const gpu = new GPU({ mode });
  const cube = [
    [
      [1,2,3,4,5],
      [6,7,8,9,10],
      [11,12,13,14,15],
    ],
    [
      [16,17,18,19,20],
      [21,22,23,24,25],
      [26,27,28,29,30],
    ]
  ];
  const kernel = gpu.createKernel(function(cube) {
    return cube[this.thread.z][this.thread.y][this.thread.x];
  }, {
    output: [5, 3, 2],
    optimizeFloatMemory: true,
    floatOutput: true,
    pipeline: true,
  });
  const result = kernel(cube).toArray();
  assert.deepEqual(result.map(matrix => matrix.map(row => Array.from(row))), cube);
  gpu.destroy();
}


(GPU.isGPUSupported ? test : skip)('float pipeline 3d output gpu (GPU only)', () => {
  floatPipeline3DOutput('gpu');
});

(GPU.isWebGLSupported ? test : skip)('float pipeline 3d output webgl (GPU only)', () => {
  floatPipeline3DOutput('webgl');
});

(GPU.isWebGL2Supported ? test : skip)('float pipeline 3d output webgl2 (GPU only)', () => {
  floatPipeline3DOutput('webgl2');
});

(GPU.isHeadlessGLSupported ? test : skip)('float pipeline 3d output headlessgl (GPU only)', () => {
  floatPipeline3DOutput('headlessgl');
});
