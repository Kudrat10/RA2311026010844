// Vehicle Maintenance Scheduler - Knapsack Optimization
// Author: Kudrat Anand - RA2311026010844

class VehicleScheduler {
  constructor() {
    this.vehicles = [];
    this.depots = [];
  }

  // Add vehicle with maintenance requirements
  addVehicle(id, maintenanceTime, priority) {
    this.vehicles.push({
      id,
      maintenanceTime,
      priority,
      value: priority // Higher priority = higher value
    });
  }

  // Add depot with capacity
  addDepot(id, capacity) {
    this.depots.push({ id, capacity, vehicles: [] });
  }

  // Knapsack optimization to maximize serviced vehicles
  optimizeSchedule() {
    const totalCapacity = this.depots.reduce((sum, depot) => sum + depot.capacity, 0);
    
    // Dynamic programming table
    const dp = Array(this.vehicles.length + 1).fill().map(() => 
      Array(totalCapacity + 1).fill(0)
    );

    // Fill DP table
    for (let i = 1; i <= this.vehicles.length; i++) {
      const vehicle = this.vehicles[i - 1];
      for (let w = 0; w <= totalCapacity; w++) {
        if (vehicle.maintenanceTime <= w) {
          dp[i][w] = Math.max(
            dp[i - 1][w],
            dp[i - 1][w - vehicle.maintenanceTime] + vehicle.value
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Backtrack to find selected vehicles
    const selectedVehicles = [];
    let w = totalCapacity;
    
    for (let i = this.vehicles.length; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selectedVehicles.push(this.vehicles[i - 1]);
        w -= this.vehicles[i - 1].maintenanceTime;
      }
    }

    return {
      totalValue: dp[this.vehicles.length][totalCapacity],
      selectedVehicles: selectedVehicles.reverse(),
      totalCapacity
    };
  }

  // Assign vehicles to depots
  assignToDepots(selectedVehicles) {
    let depotIndex = 0;
    let currentCapacity = this.depots[0]?.capacity || 0;

    selectedVehicles.forEach(vehicle => {
      // Find depot with available capacity
      while (depotIndex < this.depots.length && 
             vehicle.maintenanceTime > currentCapacity) {
        depotIndex++;
        currentCapacity = this.depots[depotIndex]?.capacity || 0;
      }

      if (depotIndex < this.depots.length) {
        this.depots[depotIndex].vehicles.push(vehicle);
        currentCapacity -= vehicle.maintenanceTime;
      }
    });

    return this.depots;
  }

  // Get optimization results
  getResults() {
    const optimization = this.optimizeSchedule();
    const depotAssignments = this.assignToDepots(optimization.selectedVehicles);

    return {
      optimization,
      depotAssignments,
      summary: {
        totalVehicles: this.vehicles.length,
        servicedVehicles: optimization.selectedVehicles.length,
        totalDepotCapacity: optimization.totalCapacity,
        efficiency: (optimization.selectedVehicles.length / this.vehicles.length * 100).toFixed(2) + '%'
      }
    };
  }
}

module.exports = VehicleScheduler;
