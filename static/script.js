document.addEventListener('DOMContentLoaded', () => {

    // --- Tab Switching Logic ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => {
                content.id === targetTab ? content.classList.add('active') : content.classList.remove('active');
            });
        });
    });

    // --- Real Generation Logic ---

    const imageBtn = document.getElementById('generate-image-btn');
    const imageResultContainer = document.getElementById('image-result-container');
    const historyList = document.getElementById('history-list');

    // Image Generation
    imageBtn.addEventListener('click', async () => {
        const prompt = document.getElementById('image-prompt').value;
        const aspectRatio = document.getElementById('aspect-ratio').value;

        if (!prompt) {
            alert("Please enter an image prompt.");
            return;
        }

        // Disable button and show loader
        imageBtn.disabled = true;
        imageBtn.textContent = "Generating...";
        imageResultContainer.innerHTML = '<div class="loader"></div>';

        try {
            // --- Send request to our OWN Flask backend ---
            const response = await fetch('/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    aspect_ratio: aspectRatio,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                // Show error message from the backend
                throw new Error(result.error || 'An unknown error occurred.');
            }

            // --- Success! Display the real image ---
            const imageUrl = result.url; // e.g., "/static/generated-images/1234.png"
            imageResultContainer.innerHTML = `
                <div class="result-item">
                    <img src="${imageUrl}" alt="Generated Image: ${prompt}">
                    <a href="${imageUrl}" download="${prompt.substring(0, 20)}.png" class="download-btn">Download Image</a>
                </div>
            `;

            // Add to history
            addHistoryItem('Image', result.prompt, imageUrl);

        } catch (error) {
            console.error("Error:", error);
            imageResultContainer.innerHTML = `<p style="color: #ff8a8a;">Error: ${error.message}</p>`;
        } finally {
            // Re-enable button
            imageBtn.disabled = false;
            imageBtn.textContent = "Generate";
        }
    });

    // --- History Logic ---
    function addHistoryItem(type, prompt, url) {
        const placeholder = historyList.querySelector('p');
        if (placeholder) placeholder.remove();

        const historyItem = document.createElement('div');
        historyItem.className = 'result-item generator-widget';
        historyItem.style.marginBottom = '1rem';
        historyItem.style.textAlign = 'left';

        let mediaElement = `<img src="${url}" alt="History Image" style="max-width: 100px; margin-right: 1rem; float: left;">`;

        historyItem.innerHTML = `
            ${mediaElement}
            <h4 style="color: #fff; margin:0;">${type} Generation</h4>
            <p style="color: #9CA3AF; font-size: 0.9rem; margin:0;">${prompt}</p>
            <div style="clear: both;"></div>
        `;

        historyList.prepend(historyItem);
    }

    // --- Video Generation Placeholder ---
    const videoBtn = document.getElementById('generate-video-btn');
    videoBtn.addEventListener('click', () => {
         alert("Video generation is not implemented yet, but will be soon!");
    });
});