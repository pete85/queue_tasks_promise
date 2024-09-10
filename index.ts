class Queue {
  private taskQueue: Array<() => Promise<any>> = [];
  private isRunning = false;

  add<P>(task: () => Promise<P>): Promise<P> {
    return new Promise((resolve, reject) => {
      const queueRunner = () => {
        return task().then(resolve).catch(reject);
      };

      // Add queue runner to the queue
      this.taskQueue.push(queueRunner);

      // Start processing if not already started
      if (!this.isRunning) {
        this.processQueue();
      }
    });
  }

  /**
   * This function is responsible for running tasks sequentially
   */
  private async processQueue(): Promise<void> {
    this.isRunning = true;

    while (this.taskQueue.length > 0) {
      const nextTask = this.taskQueue.shift();
      if (nextTask) {
        await nextTask();
      }
    }

    // Processing is complete when the queue is empty
    this.isRunning = false;
  }
}

const queue = new Queue();

queue.add(() => new Promise((resolve) => setTimeout(() => resolve('Task 1'), 1000)))
.then(console.log);

queue.add(() => new Promise((resolve) => setTimeout(() => resolve('Task 2'), 500)))
.then(console.log);

queue.add(() => new Promise((resolve) => setTimeout(() => resolve('Task 3'), 300)))
.then(console.log);