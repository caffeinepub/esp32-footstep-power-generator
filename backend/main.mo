import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  var totalFootsteps = 0;
  var totalEnergy = 0.0; // Wh
  var totalRuntime = 0; // seconds

  public query ({ caller }) func getTotalFootsteps() : async Nat {
    totalFootsteps;
  };

  public query ({ caller }) func getTotalEnergy() : async Float {
    totalEnergy;
  };

  public query ({ caller }) func getTotalRuntime() : async Nat {
    totalRuntime;
  };

  public shared ({ caller }) func addFootsteps(footsteps : Nat) : async () {
    if (footsteps == 0) { Runtime.trap("Footsteps must be at least 1") };
    totalFootsteps += footsteps;
  };

  public shared ({ caller }) func addEnergy(energy : Float) : async () {
    if (energy <= 0) { Runtime.trap("Energy must be greater than 0") };
    totalEnergy += energy;
  };

  public shared ({ caller }) func addRuntime(runtime : Nat) : async () {
    if (runtime == 0) { Runtime.trap("Runtime must be at least 1 second") };
    totalRuntime += runtime;
  };
};
