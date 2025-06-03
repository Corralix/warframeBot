const { createCanvas } = require("canvas");

function formatRelativeTime(expiryTimestamp) {
    const now = Math.floor(Date.now() / 1000);
    const diff = expiryTimestamp - now;

    if (diff <= 0) {
        const absDiffPast = Math.abs(diff);
        const minutesPast = Math.floor(absDiffPast / 60);
        const secondsPast = absDiffPast % 60;
        if (minutesPast > 60) return "Expired"; // If more than an hour ago, just "Expired"
        return `Expired ${minutesPast}m ${secondsPast}s ago`;
    }

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `Expires in ${minutes}m ${seconds}s`;
}

/**
 * Generates an image buffer displaying fissure data.
 * @param {object} fissureData - The raw data object from getFissures.
 * @param {string[]} eras - Array of era names (e.g., ["Lith", "Meso"]).
 * @param {string} difficulty - The difficulty level (e.g., "NORMAL", "STEEL PATH").
 * @returns {Promise<Buffer>} A promise that resolves with the PNG image buffer.
 */
async function generateFissureImage(fissureData, eras, difficulty) {
    // --- Configuration ---
    const canvasWidth = 800;
    const padding = 30;
    const lineHeight = 22; // Base line height for mission details
    const sectionSpacing = 20; // Space between era sections
    const titleLineHeight = 40;
    const eraTitleLineHeight = 30;

    let estimatedHeight = padding * 2 + titleLineHeight + sectionSpacing; // Initial: top/bottom padding, title, space after title

    // --- Pre-calculate required height ---
    let contentPresent = false;
    for (const era of eras) {
        if (fissureData[era] && fissureData[era].length > 0) {
            contentPresent = true;
            estimatedHeight += eraTitleLineHeight + sectionSpacing; // Era title + space after it
            fissureData[era].forEach(() => {
                estimatedHeight += lineHeight * 3 + 10; // 3 lines per fissure (type, location, expiry) + small gap
            });
        }
    }

    if (!contentPresent) {
        estimatedHeight += 60; // Space for "No fissures" message
    }
    estimatedHeight = Math.max(200, estimatedHeight); // Minimum height

    // --- Canvas Setup ---
    const canvas = createCanvas(canvasWidth, estimatedHeight);
    const ctx = canvas.getContext("2d");

    // --- Drawing ---
    // Background
    ctx.fillStyle = "#2C2F33"; // Dark grey
    ctx.fillRect(0, 0, canvasWidth, estimatedHeight);

    // Text Styles
    ctx.fillStyle = "#FFFFFF"; // White text
    ctx.font = `bold ${titleLineHeight - 10}px sans-serif`;
    ctx.textAlign = "center";

    let currentY = padding + titleLineHeight - 10;

    // Main Title
    ctx.fillText(`Current ${difficulty} Fissures`, canvasWidth / 2, currentY);
    currentY += sectionSpacing + 10;

    ctx.textAlign = "left"; // Reset alignment

    if (!contentPresent) {
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("No active fissures found for this difficulty.", canvasWidth / 2, currentY + 30);
    } else {
        for (const era of eras) {
            if (fissureData[era] && fissureData[era].length > 0) {
                ctx.font = `bold ${eraTitleLineHeight - 8}px sans-serif`;
                ctx.fillStyle = "#7289DA"; // Discord blurple for era titles
                ctx.fillText(`--- ${era} Fissures ---`, padding, currentY);
                currentY += eraTitleLineHeight;
                ctx.fillStyle = "#DCDDDE"; // Lighter grey for details

                for (const fissure of fissureData[era]) {
                    ctx.font = `bold ${lineHeight - 6}px sans-serif`;
                    ctx.fillText(`${fissure.MissionType} (${fissure.Level})`, padding + 15, currentY);
                    currentY += lineHeight;

                    ctx.font = `${lineHeight - 8}px sans-serif`;
                    ctx.fillText(`${fissure.Name}, ${fissure.Planet}`, padding + 25, currentY);
                    currentY += lineHeight;

                    const expiryText = formatRelativeTime(fissure.Expiry);
                    ctx.fillText(expiryText, padding + 25, currentY);
                    currentY += lineHeight + 10; // Add a small gap after each fissure
                }
                currentY += sectionSpacing - 10; // Space before next era (reduced a bit as gap already added)
            }
        }
    }

    return canvas.toBuffer("image/png");
}

module.exports = { generateFissureImage };
