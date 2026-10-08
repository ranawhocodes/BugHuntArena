import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArenaScreen } from '../../src/screens/Arena/ArenaScreen';
import { AppStateProvider } from '../../src/app/AppState';

function renderArena() {
  return render(
    <AppStateProvider>
      <ArenaScreen />
    </AppStateProvider>,
  );
}

describe('Arena Gameplay End-to-End Loop (Bricks 5 & 6)', () => {
  beforeEach(() => {
    window.location.hash = '';
  });
  it('renders Arena header, tabs, mission brief, and code viewer', () => {
    renderArena();

    expect(screen.getByText(/Countdown Blastoff/i)).toBeInTheDocument();
    expect(screen.getByText(/Mission Brief/i)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /python code snippet editor/i })).toBeInTheDocument();
    expect(screen.getByText(/Actual \(Buggy\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Expected/i)).toBeInTheDocument();
  });

  it('switches between Python and JavaScript languages', () => {
    renderArena();

    const jsTab = screen.getByRole('tab', { name: /JavaScript/i });
    fireEvent.click(jsTab);

    expect(screen.getByText(/Strict Pin Check/i)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /javascript code snippet editor/i })).toBeInTheDocument();
  });

  it('reduces shields when an incorrect line is chosen', () => {
    renderArena();

    // Line 1 is innocent ("def countdown():")
    const line1 = screen.getByLabelText(/Line 1:/i);
    fireEvent.click(line1);

    const confirmBtn = screen.getByRole('button', { name: /Confirm Line #1/i });
    fireEvent.click(confirmBtn);

    // Shields should decrease from 3 to 2
    expect(screen.getByLabelText(/2 out of 3 shields remaining/i)).toBeInTheDocument();
  });

  it('completes the full hunt loop: selects right line, deploys fix, reveals creature', () => {
    renderArena();

    // For py-01-off-by-one, bug line is 2: "for i in range(3, 1, -1):"
    const line2 = screen.getByLabelText(/Line 2:/i);
    fireEvent.click(line2);

    const confirmLineBtn = screen.getByRole('button', { name: /Confirm Line #2/i });
    fireEvent.click(confirmLineBtn);

    // Transitions to Step 2
    expect(screen.getByText(/Step 2: Choose the Correct Fix/i)).toBeInTheDocument();

    // Option 1 is correct (opt-a: for i in range(3, 0, -1):)
    const opt1 = screen.getByText(/range\(3, 0, -1\)/i);
    fireEvent.click(opt1);

    const deployFixBtn = screen.getByRole('button', { name: /Deploy Fix/i });
    fireEvent.click(deployFixBtn);

    // Creature reveal dialog opens
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Bug Creature Captured!/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Sliceworm/i })).toBeInTheDocument();
    expect(screen.getByText(/Code Resolution Diff/i)).toBeInTheDocument();
  });
});
