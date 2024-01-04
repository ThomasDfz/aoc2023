class MinHeap {
  constructor(key) {
    this.heap = [];
    this.key = key;
  }

  push(obj) {
    this.heap.push(obj);
    this.bubbleUp();
  }

  pop() {
    if (this.heap.length === 0) {
      return null;
    }

    const min = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown();
    }

    return min;
  }

  bubbleUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex][this.key] <= this.heap[index][this.key]) {
        break;
      }

      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  bubbleDown() {
    let index = 0;

    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (leftChild < this.heap.length && this.heap[leftChild][this.key] < this.heap[smallest][this.key]) {
        smallest = leftChild;
      }

      if (rightChild < this.heap.length && this.heap[rightChild][this.key] < this.heap[smallest][this.key]) {
        smallest = rightChild;
      }

      if (smallest === index) {
        break;
      }

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  flush() {
    this.heap = [];
  }
}

module.exports = MinHeap;
