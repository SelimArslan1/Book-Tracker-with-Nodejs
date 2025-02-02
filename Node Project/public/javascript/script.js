document.addEventListener('DOMContentLoaded', function () {
    const statusSelect = document.getElementById('status');
    const currentPageInput = document.getElementById('currentPage');
    const totalPagesInput = document.getElementById('totalPages');
    
    updateCurrentPageField(statusSelect.value);

    statusSelect.addEventListener('change', function () {
        updateCurrentPageField(this.value);
    });

    currentPageInput.addEventListener('change', function () {
        if(currentPageInput.value === totalPagesInput.value) {
            statusSelect.value = 'finished';
        }
    });

    
    function updateCurrentPageField(status) {
        if (status === 'to-read') {
            currentPageInput.value = 0;
            currentPageInput.setAttribute('max', 0);
            currentPageInput.setAttribute('min', 0);
        } else if (status === 'finished') {
            currentPageInput.value = totalPagesInput.value;
            currentPageInput.setAttribute('min', totalPagesInput.value);
            currentPageInput.setAttribute('max', totalPagesInput.value);
        } else {
            currentPageInput.setAttribute('min', 0);
            currentPageInput.setAttribute('max', totalPagesInput.value);
        }
    }
});