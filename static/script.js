document.addEventListener('DOMContentLoaded', () => {

    // --- Tab Switching Logic ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Update button active state
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update content active state
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // --- Placeholder Generation Logic ---

    const imageBtn = document.getElementById('generate-image-btn');
    const videoBtn = document.getElementById('generate-video-btn');
    const imageResultContainer = document.getElementById('image-result-container');
    const videoResultContainer = document.getElementById('video-result-container');
    const historyList = document.getElementById('history-list');

    // Image Generation Simulation
    imageBtn.addEventListener('click', () => {
        const prompt = document.getElementById('image-prompt').value;
        if (!prompt) {
            alert("Please enter an image prompt.");
            return;
        }

        // Show loader
        imageResultContainer.innerHTML = '<div class="loader"></div>';

        // Simulate API call
        setTimeout(() => {
            // Placeholder image
            const imageUrl = 'https://placehold.co/600x600/3B82F6/FFFFFF?text=Generated+Image';
            imageResultContainer.innerHTML = `
                <div class="result-item">
                    <img src="${imageUrl}" alt="Generated Image">
                    <button class="download-btn">Download Image</button>
                </div>
            `;
            // Add to history
            addHistoryItem('Image', prompt, imageUrl);
        }, 2000); // 2-second delay
    });

    // Video Generation Simulation
    videoBtn.addEventListener('click', () => {
        const prompt = document.getElementById('video-prompt').value;
        const file = document.getElementById('video-upload').files[0];

        if (!prompt && !file) {
            alert("Please enter a video prompt or upload an image.");
            return;
        }

        // Show loader
        videoResultContainer.innerHTML = '<div class="loader"></div>';

        // Simulate API call
        setTimeout(() => {
            // Placeholder video
            const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
            videoResultContainer.innerHTML = `
                <div class="result-item">
                    <video controls muted autoplay loop src="${videoUrl}"></video>
                    <button class="download-btn">Download Video</button>
                </div>
            `;
            // Add to history
            const historyPrompt = file ? `Image-to-Video: ${file.name}` : `Text-to-Video: ${prompt}`;
            addHistoryItem('Video', historyPrompt, videoUrl);
        }, 4000); // 4-second delay
    });

    // --- History Logic ---
    function addHistoryItem(type, prompt, url) {
        // Remove the "Your generated content..." placeholder if it exists
        const placeholder = historyList.querySelector('p');
        if (placeholder) {
            placeholder.remove();
        }

        const historyItem = document.createElement('div');
        historyItem.className = 'result-item generator-widget'; // Reuse widget style
        historyItem.style.marginBottom = '1rem';
        historyItem.style.textAlign = 'left';

        let mediaElement;
        if (type === 'Image') {
            mediaElement = `<img src="${url}" alt="History Image" style="max-width: 100px; margin-right: 1rem; float: left;">`;
        } else {
            mediaElement = `<video muted loop src="${url}" style="max-width: 100px; margin-right: 1rem; float: left;"></video>`;
        }

        historyItem.innerHTML = `
            ${mediaElement}
            <h4 style="color: #fff; margin:0;">${type} Generation</h4>
            <p style="color: #9CA3AF; font-size: 0.9rem; margin:0;">${prompt}</p>
            <div style="clear: both;"></div>
        `;

        // Add to the top of the list
        historyList.prepend(historyItem);
    }
});