import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { GitHubControlPanel } from '../GitHubControlPanel';

describe('GitHubControlPanel', () => {
  it('should render username input and fetch button', () => {
    const onFetch = vi.fn();

    render(
      <GitHubControlPanel
        onFetch={onFetch}
        loading={false}
        error={null}
        isRealMode={false}
        onModeToggle={vi.fn()}
        cached={new Map()}
      />
    );

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fetch/i })).toBeInTheDocument();
  });

  it('should call onFetch with username when fetch clicked', async () => {
    const user = userEvent.setup();
    const onFetch = vi.fn();

    render(
      <GitHubControlPanel
        onFetch={onFetch}
        loading={false}
        error={null}
        isRealMode={false}
        onModeToggle={vi.fn()}
        cached={new Map()}
      />
    );

    const input = screen.getByPlaceholderText(/username/i);
    const button = screen.getByRole('button', { name: /fetch/i });

    await user.type(input, 'testuser');
    await user.click(button);

    expect(onFetch).toHaveBeenCalledWith('testuser');
  });

  it('should show current mode (mock/real)', () => {
    const onModeToggle = vi.fn();

    render(
      <GitHubControlPanel
        onFetch={vi.fn()}
        loading={false}
        error={null}
        isRealMode={false}
        onModeToggle={onModeToggle}
        cached={new Map()}
      />
    );

    expect(screen.getByText(/mock/i)).toBeInTheDocument();
  });
});
