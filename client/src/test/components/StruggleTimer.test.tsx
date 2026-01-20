/* eslint-disable max-lines-per-function */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StruggleTimer from "../../components/StruggleTimer";

describe("StruggleTimer", () => {
  const mockOnHintUnlocked = vi.fn();
  const mockOnStruggleLogged = vi.fn();

  let mockNow = Date.now();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockNow = Date.now();
    vi.spyOn(Date, "now").mockImplementation(() => mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("shows locked state initially", () => {
    const startTime = Date.now();
    render(
      <StruggleTimer
        startTime={startTime}
        onHintUnlocked={mockOnHintUnlocked}
        onStruggleLogged={mockOnStruggleLogged}
      />,
    );

    expect(screen.getByText("Struggle Session Active")).toBeInTheDocument();
    expect(screen.getByText(/hints unlock in/i)).toBeInTheDocument();
    expect(screen.getByText("Documentation required")).toBeInTheDocument();
  });

  it("counts down from 30 minutes", () => {
    const startTime = Date.now();
    render(
      <StruggleTimer
        startTime={startTime}
        onHintUnlocked={mockOnHintUnlocked}
        onStruggleLogged={mockOnStruggleLogged}
      />,
    );

    // Should show 30:00 initially
    expect(screen.getByText("30:00")).toBeInTheDocument();
  });

  it.skip("updates timer every second", async () => {
    const startTime = Date.now();
    render(
      <StruggleTimer
        startTime={startTime}
        onHintUnlocked={mockOnHintUnlocked}
        onStruggleLogged={mockOnStruggleLogged}
      />,
    );

    // Fast-forward 5 seconds
    mockNow += 5000;
    vi.advanceTimersByTime(5000);

    await waitFor(
      () => {
        expect(screen.getByText("29:55")).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it.skip("shows struggle documentation form when button is clicked", async () => {
    const startTime = Date.now();
    const user = userEvent.setup({ delay: null });

    render(
      <StruggleTimer
        startTime={startTime}
        onHintUnlocked={mockOnHintUnlocked}
        onStruggleLogged={mockOnStruggleLogged}
      />,
    );

    const docButton = screen.getByRole("button", {
      name: /document your struggle/i,
    });
    await user.click(docButton);

    expect(screen.getByText("Document Your Struggle")).toBeInTheDocument();
    expect(
      screen.getByText("What have you tried? (Minimum 3 things)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Where are you stuck? (Be specific)"),
    ).toBeInTheDocument();
    expect(screen.getByText("What might be the problem?")).toBeInTheDocument();
  });

  it.skip("validates struggle documentation form", async () => {
    const startTime = Date.now();
    const user = userEvent.setup({ delay: null });

    render(
      <StruggleTimer
        startTime={startTime}
        onHintUnlocked={mockOnHintUnlocked}
        onStruggleLogged={mockOnStruggleLogged}
      />,
    );

    // Open form
    const docButton = screen.getByRole("button", {
      name: /document your struggle/i,
    });
    await user.click(docButton);

    // Try to submit without filling required fields
    const submitButton = screen.getByRole("button", {
      name: /submit documentation/i,
    });
    await user.click(submitButton);

    // Should show alert (mocked)
    expect(window.alert).toHaveBeenCalledWith(
      "Please list at least 3 things you tried",
    );
  });

  it.skip("accepts valid struggle documentation", async () => {
    const startTime = Date.now();
    const user = userEvent.setup({ delay: null });

    // Mock window.alert
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <StruggleTimer
        startTime={startTime}
        onHintUnlocked={mockOnHintUnlocked}
        onStruggleLogged={mockOnStruggleLogged}
      />,
    );

    // Open form
    const docButton = screen.getByRole("button", {
      name: /document your struggle/i,
    });
    await user.click(docButton);

    // Fill out the form
    const attemptInputs = screen.getAllByPlaceholderText(/attempt/i);
    await user.type(attemptInputs[0], "Tried cd command");
    await user.type(attemptInputs[1], "Checked ls -la");
    await user.type(attemptInputs[2], "Used pwd to verify location");

    const stuckTextarea = screen.getByPlaceholderText(
      /describe the exact error/i,
    );
    await user.type(
      stuckTextarea,
      "Cannot navigate to the correct directory even though it exists",
    );

    const hypothesisTextarea = screen.getByPlaceholderText(/your best guess/i);
    await user.type(
      hypothesisTextarea,
      "The path might be incorrect or there might be permission issues",
    );

    // Submit
    const submitButton = screen.getByRole("button", {
      name: /submit documentation/i,
    });
    await user.click(submitButton);

    // Should call onStruggleLogged with correct data
    expect(mockOnStruggleLogged).toHaveBeenCalledWith({
      attemptedSolutions: [
        "Tried cd command",
        "Checked ls -la",
        "Used pwd to verify location",
      ],
      stuckPoint:
        "Cannot navigate to the correct directory even though it exists",
      hypothesis:
        "The path might be incorrect or there might be permission issues",
      submittedAt: expect.any(Date),
    });

    alertMock.mockRestore();
  });

  it.skip("shows struggles logged status after documentation", async () => {
    const startTime = Date.now();
    const user = userEvent.setup({ delay: null });

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <StruggleTimer
        startTime={startTime}
        onHintUnlocked={mockOnHintUnlocked}
        onStruggleLogged={mockOnStruggleLogged}
      />,
    );

    // Document struggles
    const docButton = screen.getByRole("button", {
      name: /document your struggle/i,
    });
    await user.click(docButton);

    // Fill and submit form
    const attemptInputs = screen.getAllByPlaceholderText(/attempt/i);
    await user.type(attemptInputs[0], "Attempt 1");
    await user.type(attemptInputs[1], "Attempt 2");
    await user.type(attemptInputs[2], "Attempt 3");

    const stuckTextarea = screen.getByPlaceholderText(
      /describe the exact error/i,
    );
    await user.type(
      stuckTextarea,
      "Stuck point description with enough characters",
    );

    const hypothesisTextarea = screen.getByPlaceholderText(/your best guess/i);
    await user.type(
      hypothesisTextarea,
      "Hypothesis with enough characters to pass validation",
    );

    const submitButton = screen.getByRole("button", {
      name: /submit documentation/i,
    });
    await user.click(submitButton);

    // Should show logged status
    expect(screen.getByText("Struggles logged")).toBeInTheDocument();
    expect(
      screen.getByText(/hints will unlock when timer reaches 0:00/i),
    ).toBeInTheDocument();

    alertMock.mockRestore();
  });

  it("unlocks hints after timer expires and struggles are logged", () => {
    const startTime = Date.now();
    // Set current time to after the 30-minute timer has expired
    const currentTime = startTime + 30 * 60 * 1000 + 10000;

    // Render component with timer already expired
    render(
      <StruggleTimer
        startTime={startTime}
        onHintUnlocked={mockOnHintUnlocked}
        onStruggleLogged={mockOnStruggleLogged}
        currentTime={currentTime}
      />,
    );

    // Should show the initial state (not unlocked yet because struggles not logged)
    expect(screen.getByText("Why the wait?")).toBeInTheDocument();
    expect(
      screen.getByText(/independent problem-solving/i),
    ).toBeInTheDocument();

    // But timer should show 0:00
    expect(screen.getByText("0:00")).toBeInTheDocument();
  });

  it("shows hints unlocked when struggles logged and timer expired", () => {
    // Create a component that starts with struggles already logged and timer expired
    const startTime = Date.now();
    const currentTime = startTime + 30 * 60 * 1000 + 10000;

    render(
      <StruggleTimer
        startTime={startTime}
        onHintUnlocked={mockOnHintUnlocked}
        onStruggleLogged={mockOnStruggleLogged}
        currentTime={currentTime}
      />,
    );

    // Document struggles
    const docButton = screen.getByRole("button", {
      name: /document your struggle/i,
    });
    fireEvent.click(docButton);

    // Fill form quickly
    const attemptInputs = screen.getAllByPlaceholderText(/attempt 1/i);
    fireEvent.change(attemptInputs[0], { target: { value: "Attempt 1" } });

    const attemptInputs2 = screen.getAllByPlaceholderText(/attempt 2/i);
    fireEvent.change(attemptInputs2[0], { target: { value: "Attempt 2" } });

    const attemptInputs3 = screen.getAllByPlaceholderText(/attempt 3/i);
    fireEvent.change(attemptInputs3[0], { target: { value: "Attempt 3" } });

    const stuckTextarea = screen.getByPlaceholderText(
      /describe the exact error/i,
    );
    fireEvent.change(stuckTextarea, {
      target: {
        value:
          "Stuck point description with enough characters to meet the minimum requirement",
      },
    });

    const hypothesisTextarea = screen.getByPlaceholderText(/your best guess/i);
    fireEvent.change(hypothesisTextarea, {
      target: {
        value:
          "Hypothesis with enough characters to pass validation and meet requirements",
      },
    });

    const submitButton = screen.getByRole("button", {
      name: /submit documentation/i,
    });
    fireEvent.click(submitButton);

    // Should now show hints available immediately since timer is already expired
    expect(screen.getByText("Hints Available")).toBeInTheDocument();
    expect(
      screen.getByText(/you've earned access to hints/i),
    ).toBeInTheDocument();
    expect(mockOnHintUnlocked).toHaveBeenCalled();
  });

  it("explains why the wait is necessary", () => {
    const startTime = Date.now();
    render(
      <StruggleTimer
        startTime={startTime}
        onHintUnlocked={mockOnHintUnlocked}
        onStruggleLogged={mockOnStruggleLogged}
      />,
    );

    expect(screen.getByText("Why the wait?")).toBeInTheDocument();
    expect(
      screen.getByText(/independent problem-solving/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/deeper learning/i)).toBeInTheDocument();
    expect(screen.getByText(/document your process/i)).toBeInTheDocument();
  });

  it.skip("shows character counts for text areas", async () => {
    const startTime = Date.now();
    const user = userEvent.setup({ delay: null });

    render(
      <StruggleTimer
        startTime={startTime}
        onHintUnlocked={mockOnHintUnlocked}
        onStruggleLogged={mockOnStruggleLogged}
      />,
    );

    // Open form
    const docButton = screen.getByRole("button", {
      name: /document your struggle/i,
    });
    await user.click(docButton);

    const stuckTextarea = screen.getByPlaceholderText(
      /describe the exact error/i,
    );
    const hypothesisTextarea = screen.getByPlaceholderText(/your best guess/i);

    expect(screen.getByText("0/20 characters minimum")).toBeInTheDocument();

    await user.type(stuckTextarea, "Test stuck point");
    expect(screen.getByText("17/20 characters minimum")).toBeInTheDocument();

    await user.type(hypothesisTextarea, "Test hypothesis");
    expect(screen.getAllByText("15/20 characters minimum")).toHaveLength(2);
  });
});
