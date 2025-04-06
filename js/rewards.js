const rewardsSystem = {
    points: 0,
    
    calculatePoints(orderTotal) {
        return Math.floor(orderTotal / 100) * 10;
    },
    
    addPoints(amount) {
        this.points += this.calculatePoints(amount);
        this.updateUI();
        this.checkTier();
    },
    
    getTier() {
        if (this.points >= 1000) return 'Gold';
        if (this.points >= 500) return 'Silver';
        return 'Bronze';
    }
};