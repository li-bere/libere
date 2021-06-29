function reportError(error: string, context = {}) {
    console.log('error reporter called');
    console.log(error);
    console.log(context);
  
    return new Promise((resolve) => {
        console.error(error, context);
        resolve();
    });
}

export{ reportError };