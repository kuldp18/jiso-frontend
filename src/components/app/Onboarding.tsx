import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2, Loader, ArrowLeft, ArrowRight } from "lucide-react";
import { Goal, Struggle } from "@/types/auth.types";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Schema for a single goal
const goalSchema = z.object({
  goal: z.string().min(1, { message: "Goal title is required" }),
  description: z.string().optional(),
});

// Schema for a single struggle
const struggleSchema = z.object({
  struggle: z.string().min(1, { message: "Struggle is required" }),
  severity: z.string().default("5"), // Using string to match the component state
});

// Schema for the onboarding form
const onboardingSchema = z.object({
  goals: z
    .array(goalSchema)
    .min(1, { message: "At least one goal is required" }),
  struggles: z
    .array(struggleSchema)
    .min(1, { message: "At least one struggle is required" }),
});

type FormValues = z.infer<typeof onboardingSchema>;

const Onboarding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(1); // 1 for goals, 2 for struggles
  const [goals, setGoals] = useState<Goal[]>([{ goal: "", description: "" }]);
  const [struggles, setStruggles] = useState<Struggle[]>([
    { struggle: "", severity: "5" },
  ]);
  const onboardUser = useAuthStore((state) => state.onboardUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  const form = useForm<FormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      goals: [{ goal: "", description: "" }],
      struggles: [{ struggle: "", severity: "5" }], // Match the state type
    },
  });

  // Check if the user came from signup page
  useEffect(() => {
    // Check location state or if the user just registered
    const fromSignup = location.state?.fromSignup === true;
    const needsOnboarding = location.state?.needsOnboarding === true;

    if (fromSignup || needsOnboarding) {
      setShowOnboarding(true);
    }
  }, [location]);

  // Update form values when goals or struggles change
  useEffect(() => {
    form.setValue("goals", goals);
  }, [goals, form]);

  useEffect(() => {
    form.setValue(
      "struggles",
      struggles.map((struggle) => ({
        ...struggle,
        severity: String(struggle.severity || "5"),
      }))
    );
  }, [struggles, form]);

  // If not showing onboarding, render nothing
  if (!showOnboarding) {
    return null;
  }

  // Goal input handlers
  const addGoal = () => {
    setGoals([...goals, { goal: "", description: "" }]);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      const updatedGoals = [...goals];
      updatedGoals.splice(index, 1);
      setGoals(updatedGoals);
    } else {
      toast.error("At least one goal is required");
    }
  };

  const updateGoal = (index: number, field: keyof Goal, value: string) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    setGoals(updatedGoals);
  };

  // Struggle input handlers
  const addStruggle = () => {
    setStruggles([...struggles, { struggle: "", severity: "5" }]);
  };

  const removeStruggle = (index: number) => {
    if (struggles.length > 1) {
      const updatedStruggles = [...struggles];
      updatedStruggles.splice(index, 1);
      setStruggles(updatedStruggles);
    } else {
      toast.error("At least one struggle is required");
    }
  };

  const updateStruggle = (
    index: number,
    field: keyof Struggle,
    value: string
  ) => {
    const updatedStruggles = [...struggles];
    updatedStruggles[index] = { ...updatedStruggles[index], [field]: value };
    setStruggles(updatedStruggles);
  };

  // Handle slider value change
  const handleSliderChange = (index: number, values: number[]) => {
    const updatedStruggles = [...struggles];
    updatedStruggles[index] = {
      ...updatedStruggles[index],
      severity: String(values[0]),
    };
    setStruggles(updatedStruggles);
  };

  // Next step handler
  const handleNextStep = () => {
    // Validate goals before proceeding
    const goalsValid = goals.every((goal) => goal.goal.trim() !== "");
    if (!goalsValid) {
      toast.error("All goals must have a title");
      return;
    }

    if (goals.length === 0) {
      toast.error("At least one goal is required");
      return;
    }

    setStep(2);
  };

  // Previous step handler
  const handlePrevStep = () => {
    setStep(1);
  };

  // Form submission
  const onSubmit = async () => {
    // Validate struggles before submission
    const strugglesValid = struggles.every(
      (struggle) =>
        struggle.struggle.trim() !== "" &&
        parseInt(String(struggle.severity || "0")) >= 0
    );

    if (!strugglesValid) {
      toast.error("All struggles must have a title and severity rating");
      return;
    }

    if (struggles.length === 0) {
      toast.error("At least one struggle is required");
      return;
    }

    try {
      // API expects the original data structure, no need to convert
      await onboardUser(goals, struggles);
      toast.success("Onboarding completed successfully!");
      setShowOnboarding(false);

      // Navigate to dashboard without the onboarding state
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Failed to complete onboarding. Please try again.");
    }
  };

  // Render goals step
  const renderGoalsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Set Your Goals</h2>
        <p className="text-muted-foreground">
          What do you want to achieve with Jiso? Add at least one goal.
        </p>
      </div>

      {goals.map((goal, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-card">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium">Goal {index + 1}</h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeGoal(index)}
              disabled={goals.length === 1}
              title="Remove goal"
            >
              <Trash2 className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <FormLabel>Goal Title *</FormLabel>
              <Input
                value={goal.goal}
                onChange={(e) => updateGoal(index, "goal", e.target.value)}
                placeholder="e.g., Improve my mental health"
                className="mt-1"
              />
              {goal.goal.trim() === "" && (
                <p className="text-destructive text-xs mt-1">
                  Goal title is required
                </p>
              )}
            </div>

            <div>
              <FormLabel>Description (Optional)</FormLabel>
              <Input
                value={goal.description || ""}
                onChange={(e) =>
                  updateGoal(index, "description", e.target.value)
                }
                placeholder="Brief description of your goal"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={addGoal}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Another Goal
      </Button>

      <div className="flex justify-end mt-8">
        <Button
          type="button"
          onClick={handleNextStep}
          className="flex gap-2 items-center"
        >
          Next <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );

  // Render struggles step
  const renderStrugglesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Share Your Struggles</h2>
        <p className="text-muted-foreground">
          What challenges are you facing? Rate their severity from 0 to 10.
        </p>
      </div>

      {struggles.map((struggle, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-card">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium">Struggle {index + 1}</h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeStruggle(index)}
              disabled={struggles.length === 1}
              title="Remove struggle"
            >
              <Trash2 className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <FormLabel>Struggle *</FormLabel>
              <Input
                value={struggle.struggle}
                onChange={(e) =>
                  updateStruggle(index, "struggle", e.target.value)
                }
                placeholder="e.g., Stress from work"
                className="mt-1"
              />
              {struggle.struggle.trim() === "" && (
                <p className="text-destructive text-xs mt-1">
                  Struggle description is required
                </p>
              )}
            </div>

            <div>
              <FormLabel>Severity (0-10) *</FormLabel>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[parseInt(String(struggle.severity || "5"))]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(values) =>
                      handleSliderChange(index, values)
                    }
                    className="flex-1"
                  />
                  <span className="w-8 text-center bg-secondary/30 rounded-md p-1">
                    {struggle.severity || "5"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>Mild</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={addStruggle}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Another Struggle
      </Button>

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevStep}
          className="flex gap-2 items-center"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="flex gap-2 items-center"
        >
          {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
          Complete Onboarding
        </Button>
      </div>
    </div>
  );

  // Progress indicator
  const ProgressIndicator = () => (
    <div className="flex items-center mb-6">
      <div className="flex items-center">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
            step === 1
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          1
        </div>
        <div className="h-1 w-10 bg-muted">
          <div
            className={cn(
              "h-full bg-primary transition-all",
              step === 1 ? "w-0" : "w-full"
            )}
          />
        </div>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
            step === 2
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          2
        </div>
      </div>
      <span className="ml-3 text-sm text-muted-foreground">
        Step {step} of 2
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card pb-4">
          <ProgressIndicator />
        </div>
        <Form {...form}>
          <form className="space-y-6">
            {step === 1 ? renderGoalsStep() : renderStrugglesStep()}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Onboarding;
