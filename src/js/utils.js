export const btnDisabledHandler = (state, btns, reversStateBtns = []) => {
    if (Array.isArray(btns)) {
        btns.forEach(btn => {
            btn.disabled = !state;
        });
    }
    if (Array.isArray(reversStateBtns)) {
        reversStateBtns.forEach(btn => {
            btn.disabled = state;
        });
    }
};

export const makeClearCanvas = (canvas) => {
    if (canvas) {
        const ctx = canvas.getContext('2d');
        return () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    } else {
        throw new Error('No canvas element');
    }
};
