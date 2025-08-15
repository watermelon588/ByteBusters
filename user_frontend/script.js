/* Shared script for demo app */

// SOS demo action on all pages
document.querySelectorAll('.sos-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const confirmEmergency = confirm('Are you experiencing a medical emergency?\n\nClick OK to simulate emergency actions (demo).');
    if (confirmEmergency) {
      alert('🚨 EMERGENCY ALERT (demo)\n• Emergency services alerted\n• Emergency contacts notified\n• Location shared (if available)');
    }
  });
});

// Generic error logging
window.addEventListener('error', (e) => {
  console.error('App error:', e.error || e.message || e);
});
