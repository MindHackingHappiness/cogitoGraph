# GitHub Data Integration Design

**Goal:** Add real GitHub repository visualization to cogitoGraph with mock API support, featuring topic clustering, orbital 3D layout, and interactive exploration.

**Architecture:** User enters GitHub username → Toggle Mock/Real mode → Fetch repos → Topic clustering → 3D rendering → Interactivity (hover, click, zoom).

**Tech Stack:** React Three Fiber, GitHub REST API, LDA/keyword clustering, Vitest, Playwright.

---

## Section 1: Architecture Overview

### Core Flow

```
User Input → Data Manager → API Layer → Topic Clusterer → Visualizer → 3D Scene
    ↓             ↓            ↓            ↓              ↓           ↓
  Username    Fetch Logic   Mock/Real    LDA Clustering  React     Three.js
               Cache        GitHub API    Keyword Extract  Memo     GPU Render
               Validation    Rate Limit    Force Layout             Stats
```

### Components

- **GitHubDataManager**: Orchestrator component (state, caching, error handling)
- **useGitHubData**: Custom hook for data fetching (in-memory cache, loading state)
- **TopicClusterer**: Groups repos by language/topic (frontend, backend, ML/AI, DevOps)
- **GitHubVisualizer**: 3D scene renderer using React Three Fiber
- **GitHubControlPanel**: Input controls (username, mock/real toggle, search, zoom)
- **GitHubNode**: Individual repository node (sphere with size/color encoding)

### Data Model

```typescript
interface GitHubRepo {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  topics: string[];
  updatedAt: string;
}
```

---

## Section 2: UI Design

### Control Panel

Top of screen, cyberpunk-tech aesthetic matching current cogitoGraph style:

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 GITHUB DATA VISUALIZATION                                │
├─────────────────────────────────────────────────────────────┤
│ [@] Username: [__________] [🔄 FETCH] [☁️ MOCK | 🌐 REAL]  │
│ [🔍 SEARCH: ____________] [🔍+ ZOOM] [⟲ RESET]             │
└─────────────────────────────────────────────────────────────┘
```

**Controls:**
- **Username input**: Text field for GitHub username (defaults to demo user in mock mode)
- **Fetch button**: Triggers data retrieval (disabled during fetch)
- **Mock/Real toggle**: Switch between mock API and live GitHub API calls
  - Mock mode: Use generated data (fast, no rate limits)
  - Real mode: Fetch from GitHub API (requires rate limit handling)
- **Search filter**: Real-time node filtering (fades non-matching nodes)
- **Zoom controls**: Zoom in/out of selected cluster
- **Reset button**: Return to default view (all clusters visible)

### 3D Scene Composition

**Layout**: Orbital arrangement with topic clusters grouped spatially

```
                    ┌─────────────────┐
                    │  Frontend/UI    │
                    │    (purple)     │
          ┌─────────────────────────────────┐
          │              │                  │
    ┌─────┴─────┐   ┌────▼────┐   ┌────────┴─────┐
    │  Backend  │   │  Core   │   │    ML/AI     │
    │  (blue)   │   │ (green) │   │    (orange)  │
    └───────────┘   └─────────┘   └──────────────┘
```

- **Topic clusters**: Grouped by language/topic (frontend, backend, ML/AI, DevOps, etc.)
- **Cluster centers**: Larger hub nodes with topic labels
- **Cluster members**: Orbit around their topic hub (maintain cogitoGraph's orbital aesthetic)
- **Inter-cluster connections**: Thin lines showing shared topics or dependencies

### Node Appearance

**Visual encoding (fast to read at a glance):**

1. **Size** → Star count (bigger = more popular)
   - Small: < 50 stars
   - Medium: 50-500 stars
   - Large: 500-5000 stars
   - XL: 5000+ stars

2. **Color** → Primary language
   - TypeScript/JavaScript: Yellow (#f1e05a)
   - Python: Blue (#3572A5)
   - Rust: Orange (#dea584)
   - Go: Cyan (#00ADD8)
   - Other: Gray per language

3. **Labels** → Repo name (always visible, sized by importance)

4. **Badges** → Fork count (small badge next to node)

5. **Activity pulse** → Recent commits (subtle glow animation)

**Hover state:**
- Node scales up 1.5x
- Description appears in floating HTML label
- "Open in GitHub" button appears
- Connected nodes highlight

**Click behavior:**
- Camera zooms to node
- Detail panel slides in from right
- Shows: full description, stars, forks, last commit, languages

### Responsive Design

- **Mobile**: Control panel collapses to drawer (swipe to open)
- **Desktop**: Full control panel always visible
- **3D scene**: Auto-adjusts camera based on screen size

---

## Section 3: Data Flow

### Step-by-Step Flow

**1. User Input (ControlPanel → GitHubDataManager)**
```typescript
handleFetch(username: string, useRealAPI: boolean)
```
- Validates username (non-empty, alphanumeric + hyphens)
- Checks if already cached (skip fetch if data exists)
- Triggers fetch pipeline

**2. Data Fetching (GitHubDataManager)**
```typescript
async fetchRepos(username: string, useRealAPI: boolean): Promise<GitHubRepo[]>
```

**Mock Mode Path:**
- Returns generated data from `mockGitHubData.ts`
- 100 repos with realistic distributions
- Simulates network delay (500ms) for UX consistency
- **No rate limits, always works**

**Real Mode Path:**
- Calls GitHub REST API: `GET /users/{username}/repos`
- Handles pagination (100 repos max, 30 per page)
- Rate limit handling:
  - Detects 403 response
  - Shows toast: "Rate limited. Reset in {X} seconds"
  - Auto-retries after reset time
- Error handling:
  - 404: User not found → toast error
  - 500+: Server error → retry with exponential backoff
  - Network error: use cached data if available

**3. Data Enrichment**
```typescript
enrichRepoData(repos: BasicRepo[]): GitHubRepo[]
```
- Extracts primary language from `language` field
- Calculates activity score (commits in last 30 days from events API)
- Determines repo size (stars → visual size)
- Parses description (null → "No description")

**4. Topic Clustering (TopicClusterer)**
```typescript
clusterReposByTopic(repos: GitHubRepo[]): Map<string, GitHubRepo[]>
```

**Clustering Algorithm:**
- **Primary**: Group by primary language (frontend, backend, DevOps, ML/AI)
- **Secondary**: Use `topics` array from GitHub API for fine-grained clustering
  - Example: "react", "vue", "angular" → Frontend subgroup
- **Fallback**: Keyword extraction from repo name/description
  - Regex patterns: `/(test|spec|mock)/i` → Testing
  - Regex patterns: `/(api|server|backend)/i` → Backend

**5. Force Layout (ForceGraph)**
```typescript
calculatePositions(clusters: Map<string, GitHubRepo[]>): NodePositions
```
- Each cluster gets a center point (orbital arrangement)
- Nodes within cluster orbit around center (maintains cogitoGraph aesthetic)
- Cluster centers positioned to minimize crossing connections
- **Maintains your existing spherical layout**

**6. Rendering (GitHubVisualizer)**
```typescript
<GitHubVisualizer nodes={positionedNodes} clusters={clusters} />
```
- Uses existing `DataNodes` component (extend with new props)
- Adds `GitHubNode` component (extends Sphere with badges, labels)
- Uses existing `Line` component for cluster connections
- React.memo on entire visualizer (re-render only when data changes)

### State Management

```typescript
// GitHubDataManager state
const [repos, setRepos] = useState<GitHubRepo[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [isRealMode, setIsRealMode] = useState(false);
const [clusteredData, setClusteredData] = useState<Map<string, GitHubRepo[]>>(new Map());
```

### Caching Strategy

- **In-memory cache**: Store fetched repos by username
- **Cache key**: `${username}_${isRealMode}`
- **TTL**: 5 minutes (real mode), infinite (mock mode)
- **Invalidation**: User toggles mock/real mode or enters new username

---

## Section 4: Implementation Details

### File Structure

```
src/
├── lib/
│   └── github/
│       ├── types.ts                    # GitHubRepo, GitHubUser interfaces
│       ├── mockData.ts                 # 100 generated repos
│       ├── api.ts                      # GitHub API client (fetch, rate limit handling)
│       ├── clusterer.ts                # Topic clustering logic
│       └── utils.ts                    # Helper functions (size calculation, colors)
├── hooks/
│   └── useGitHubData.ts                # Data fetching hook (cache, loading state)
├── components/
│   ├── spatial/
│   │   ├── GitHubVisualizer.tsx        # 3D scene renderer
│   │   └── GitHubNode.tsx              # Individual repository node
│   ├── ui/
│   │   └── GitHubControlPanel.tsx      # Input controls (username, toggle)
│   └── GitHubDataManager.tsx           # Orchestrator component
└── config/
    └── githubLanguages.ts              # Language color mappings
```

### Key Components

**1. GitHubDataManager.tsx**
```typescript
interface GitHubDataManagerProps {
  onDataReady: (repos: GitHubRepo[]) => void;
}

export const GitHubDataManager: React.FC<GitHubDataManagerProps> = ({ onDataReady }) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRealMode, setIsRealMode] = useState(false);

  // Wrap useGitHubData hook
  const { fetchRepos, cached } = useGitHubData();

  const handleFetch = async (username: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchRepos(username, isRealMode);
      setRepos(data);
      onDataReady(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="github-data-manager">
      <GitHubControlPanel
        onFetch={handleFetch}
        loading={loading}
        error={error}
        isRealMode={isRealMode}
        onModeToggle={() => setIsRealMode(!isRealMode)}
        cached={cached}
      />
      {repos.length > 0 && (
        <GitHubVisualizer repos={repos} />
      )}
    </div>
  );
};
```

**2. useGitHubData.ts (Hook)**
```typescript
export const useGitHubData = () => {
  const cache = useRef<Map<string, { data: GitHubRepo[]; timestamp: number }>>(new Map());

  const fetchRepos = async (username: string, isRealMode: boolean): Promise<GitHubRepo[]> => {
    const cacheKey = `${username}_${isRealMode}`;
    const cached = cache.current.get(cacheKey);

    // Check cache (5-minute TTL for real mode)
    if (cached && (Date.now() - cached.timestamp < 300000 || !isRealMode)) {
      return cached.data;
    }

    // Fetch from API or mock
    const data = isRealMode
      ? await fetchFromGitHubAPI(username)
      : await fetchMockData(username);

    // Cache result
    cache.current.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  };

  return { fetchRepos, cache: cache.current };
};
```

**3. GitHubVisualizer.tsx**
```typescript
interface GitHubVisualizerProps {
  repos: GitHubRepo[];
}

export const GitHubVisualizer: React.FC<GitHubVisualizerProps> = memo(({ repos }) => {
  const clusters = useMemo(() => clusterReposByTopic(repos), [repos]);
  const nodePositions = useMemo(() => calculateNodePositions(clusters), [clusters]);

  return (
    <group>
      {/* Render cluster centers */}
      {Array.from(clusters.entries()).map(([topic, repos]) => (
        <ClusterCenter
          key={topic}
          topic={topic}
          position={nodePositions.centers[topic]}
          repoCount={repos.length}
        />
      ))}

      {/* Render individual repos */}
      {repos.map((repo) => (
        <GitHubNode
          key={repo.id}
          repo={repo}
          position={nodePositions.nodes[repo.id]}
        />
      ))}

      {/* Render connections */}
      <ClusterConnections clusters={clusters} positions={nodePositions} />
    </group>
  );
});
```

**4. GitHubNode.tsx (Individual Node)**
```typescript
interface GitHubNodeProps {
  repo: GitHubRepo;
  position: [number, number, number];
}

export const GitHubNode: React.FC<GitHubNodeProps> = memo(({ repo, position }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  // Size based on stars
  const size = useMemo(() => calculateNodeSize(repo.stars), [repo.stars]);

  // Color based on language
  const color = useMemo(() => getLanguageColor(repo.language), [repo.language]);

  return (
    <group position={position}>
      {/* Main node sphere */}
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onClick={() => window.open(repo.url, '_blank')}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={color} />
      </Sphere>

      {/* Repo name label */}
      <Html position={[0, size + 0.5, 0]} center>
        <div className="text-xs font-mono">{repo.name}</div>
      </Html>

      {/* Fork count badge */}
      {repo.forks > 0 && (
        <Html position={[size * 0.7, size * 0.7, 0]} center>
          <div className="text-[8px] bg-black/50 px-1 rounded">
            🔱 {repo.forks}
          </div>
        </Html>
      )}

      {/* Hover detail popup */}
      {hovered && (
        <Html position={[0, size + 1.5, 0]} center distanceFactor={10}>
          <div className="bg-black/90 border border-cyber-primary p-3 rounded max-w-xs">
            <h3 className="text-cyber-primary font-bold">{repo.name}</h3>
            <p className="text-xs mt-1">{repo.description}</p>
            <div className="flex gap-2 mt-2 text-xs">
              <span>⭐ {repo.stars}</span>
              <span>🔱 {repo.forks}</span>
              <span className={getLanguageColorClass(repo.language)}>{repo.language}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
});
```

### Mock Data Generation

**mockData.ts**
```typescript
export const generateMockGitHubData = (username: string): GitHubRepo[] => {
  const languages = ['TypeScript', 'Python', 'Rust', 'Go', 'JavaScript'];
  const topics = ['frontend', 'backend', 'ml-ai', 'devops', 'testing'];

  return Array.from({ length: 100 }, (_, i) => ({
    id: `mock-${i}`,
    name: `${username}/${topics[i % topics.length]}-${i}`,
    description: `A ${topics[i % topics.length]} project built with ${languages[i % languages.length]}`,
    language: languages[i % languages.length],
    stars: Math.floor(Math.random() * 10000),
    forks: Math.floor(Math.random() * 500),
    url: `https://github.com/${username}/${topics[i % topics.length]}-${i}`,
    topics: [topics[i % topics.length]],
    updatedAt: new Date().toISOString(),
  }));
};
```

### Integration with Existing cogitoGraph

**App.tsx modification:**
```typescript
// Add GitHub scene to existing scenes
type SceneType = 'cognitive' | 'neural' | 'quantum' | 'github';

export const App = () => {
  const [currentScene, setCurrentScene] = useState<SceneType>('cognitive');

  return (
    <>
      {currentScene === 'github' ? (
        <GitHubDataManager onDataReady={(repos) => console.log('Ready', repos)} />
      ) : (
        <XRVisualizationRoom scene={currentScene} />
      )}

      {/* Add GitHub to scene switcher */}
      <HolographicUI
        currentScene={currentScene}
        onSceneChange={setCurrentScene}
      />
    </>
  );
};
```

---

## Section 5: Testing Strategy

### Testing Pyramid

```
        ┌─────────────┐
        │   E2E Tests │  ← Playwright (user flows)
        │     (10%)   │
        ├─────────────┤
        │Integration  │  ┌──────────────────────────────┐
        │   Tests     │  │Component + API integration  │
        │    (30%)    │  └──────────────────────────────┘
        ├─────────────┤
        │  Unit Tests │  ┌──────────────────────────────┐
        │   (60%)     │  │Hooks, utils, clustering algo │
        └─────────────┘  └──────────────────────────────┘
```

### Unit Tests (Vitest)

**1. Clustering Logic Tests**
```typescript
// src/lib/github/__tests__/clusterer.test.ts
import { describe, it, expect } from 'vitest';
import { clusterReposByTopic } from '../clusterer';

describe('clusterReposByTopic', () => {
  it('should group repos by language', () => {
    const repos = [
      { id: '1', language: 'TypeScript', topics: ['frontend'] },
      { id: '2', language: 'TypeScript', topics: ['frontend'] },
      { id: '3', language: 'Python', topics: ['ml-ai'] },
    ] as GitHubRepo[];

    const clusters = clusterReposByTopic(repos);

    expect(clusters.get('TypeScript')).toHaveLength(2);
    expect(clusters.get('Python')).toHaveLength(1);
  });

  it('should handle repos without topics', () => {
    const repos = [
      { id: '1', language: 'JavaScript', topics: [] },
    ] as GitHubRepo[];

    const clusters = clusterReposByTopic(repos);

    expect(clusters.get('JavaScript')).toBeDefined();
  });

  it('should extract topics from repo names as fallback', () => {
    const repos = [
      { id: '1', name: 'user/api-server', language: 'Go', topics: [] },
    ] as GitHubRepo[];

    const clusters = clusterReposByTopic(repos);

    expect(clusters.get('backend')).toBeDefined();
  });
});
```

**2. Hook Tests**
```typescript
// src/hooks/__tests__/useGitHubData.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGitHubData } from '../useGitHubData';

describe('useGitHubData', () => {
  it('should cache fetched data', async () => {
    const { result } = renderHook(() => useGitHubData());

    // First fetch
    let data1 = await act(() => result.current.fetchRepos('testuser', false));
    expect(data1).toHaveLength(100);

    // Second fetch (should return cached)
    let data2 = await act(() => result.current.fetchRepos('testuser', false));
    expect(data2).toEqual(data1);
  });

  it('should invalidate cache when mode changes', async () => {
    const { result } = renderHook(() => useGitHubData());

    let mockData = await act(() => result.current.fetchRepos('testuser', false));
    let realData = await act(() => result.current.fetchRepos('testuser', true));

    expect(mockData).not.toEqual(realData);
  });
});
```

**3. Utility Function Tests**
```typescript
// src/lib/github/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { calculateNodeSize, getLanguageColor } from '../utils';

describe('calculateNodeSize', () => {
  it('should return small size for repos < 50 stars', () => {
    expect(calculateNodeSize(25)).toBe(0.5);
  });

  it('should return medium size for repos 50-500 stars', () => {
    expect(calculateNodeSize(250)).toBe(1.0);
  });

  it('should return large size for repos 500-5000 stars', () => {
    expect(calculateNodeSize(2500)).toBe(1.5);
  });

  it('should return XL size for repos 5000+ stars', () => {
    expect(calculateNodeSize(10000)).toBe(2.0);
  });
});
```

### Integration Tests (React Testing Library)

**1. Component Integration**
```typescript
// src/components/__tests__/GitHubDataManager.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GitHubDataManager } from '../GitHubDataManager';

describe('GitHubDataManager', () => {
  it('should fetch repos when user enters username', async () => {
    const onDataReady = vi.fn();
    render(<GitHubDataManager onDataReady={onDataReady} />);

    const input = screen.getByPlaceholderText(/username/i);
    const fetchButton = screen.getByRole('button', { name: /fetch/i });

    await userEvent.type(input, 'testuser');
    await userEvent.click(fetchButton);

    await waitFor(() => {
      expect(onDataReady).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: expect.stringContaining('testuser') })
        ])
      );
    });
  });

  it('should toggle between mock and real mode', async () => {
    render(<GitHubDataManager onDataReady={vi.fn()} />);

    const toggle = screen.getByRole('button', { name: /mock/i });

    // Initial state: mock mode
    expect(toggle).toHaveTextContent(/mock/i);

    // Toggle to real mode
    await userEvent.click(toggle);
    expect(toggle).toHaveTextContent(/real/i);
  });
});
```

**2. Visualizer Component**
```typescript
// src/components/spatial/__tests__/GitHubVisualizer.test.tsx
import { render } from '@testing-library/react';
import { GitHubVisualizer } from '../GitHubVisualizer';
import { repos } from '@/lib/github/mockData';

describe('GitHubVisualizer', () => {
  it('should render all repo nodes', () => {
    const { container } = render(<GitHubVisualizer repos={repos} />);

    // Check that sphere elements are rendered
    const spheres = container.querySelectorAll('canvas');
    expect(spheres).toHaveLength(1);
  });
});
```

### E2E Tests (Playwright)

**1. User Flow Test**
```typescript
// tests/e2e/github-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('GitHub Data Flow', () => {
  test('should complete full fetch and visualize flow', async ({ page }) => {
    await page.goto('http://localhost:8082');

    // Switch to GitHub scene
    await page.click('button:has-text("GITHUB")');

    // Enter username
    await page.fill('input[placeholder*="username"]', 'testuser');

    // Click fetch
    await page.click('button:has-text("FETCH")');

    // Wait for visualization to appear
    await page.waitForSelector('.github-visualizer');

    // Verify nodes are rendered
    const nodes = await page.locator('.github-node').count();
    expect(nodes).toBeGreaterThan(0);

    // Test hover interaction
    await page.hover('.github-node:first-child');
    await expect(page.locator('.github-detail-popup')).toBeVisible();

    // Test click to open GitHub
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click('.github-node:first-child')
    ]);
    await expect(newPage).toHaveURL(/github\.com/);
  });

  test('should toggle mock/real mode', async ({ page }) => {
    await page.goto('http://localhost:8082');
    await page.click('button:has-text("GITHUB")');

    // Verify mock mode is default
    await expect(page.locator('button:has-text("MOCK")')).toBeVisible();

    // Toggle to real mode
    await page.click('button:has-text("MOCK")');
    await expect(page.locator('button:has-text("REAL")')).toBeVisible();
  });
});
```

### Performance Tests

**1. Render Performance**
```typescript
// tests/performance/render-performance.test.ts
import { test, expect } from '@playwright/test';

test('should render 100 nodes at 60fps', async ({ page }) => {
  await page.goto('http://localhost:8082?scene=github&username=testuser');

  // Wait for initial render
  await page.waitForSelector('.github-visualizer');

  // Measure FPS during interaction
  const fps = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let frames = 0;
      let startTime = performance.now();

      function countFrames() {
        frames++;
        const elapsed = performance.now() - startTime;

        if (elapsed >= 1000) {
          resolve(frames);
        } else {
          requestAnimationFrame(countFrames);
        }
      }

      requestAnimationFrame(countFrames);
    });
  });

  expect(fps).toBeGreaterThanOrEqual(55); // Allow slight drop below 60
});
```

**2. Memory Leak Test**
```typescript
test('should not leak memory when switching scenes', async ({ page }) => {
  await page.goto('http://localhost:8082');

  const getMemory = () => page.evaluate(() => {
    return (performance as any).memory?.usedJSHeapSize || 0;
  });

  const initialMemory = await getMemory();

  // Switch scenes 10 times
  for (let i = 0; i < 10; i++) {
    await page.click('button:has-text("GITHUB")');
    await page.waitForTimeout(100);
    await page.click('button:has-text("COGNITIVE")');
    await page.waitForTimeout(100);
  }

  const finalMemory = await getMemory();
  const memoryGrowth = (finalMemory - initialMemory) / initialMemory;

  // Memory growth should be less than 10%
  expect(memoryGrowth).toBeLessThan(0.1);
});
```

### Test Coverage Goals

| Component Type | Target Coverage |
|----------------|-----------------|
| Hooks & Utils | 90%+ |
| Clustering Logic | 95%+ (critical path) |
| Components | 80%+ |
| E2E Flows | All user journeys |

---

## Success Criteria

✅ **Functional:**
- User can enter GitHub username and see 100 repos visualized
- Mock mode works without API calls (fast, no rate limits)
- Real mode fetches from GitHub API with proper error handling
- Topic clustering groups repos by language/topic
- Nodes sized by stars, colored by language
- Hover shows details, click opens GitHub URL

✅ **Performance:**
- Maintains 60fps with 100 nodes
- No memory leaks when switching scenes
- Caching works (5-minute TTL for real mode)

✅ **Quality:**
- 90%+ test coverage on hooks/utils
- All E2E flows pass
- TypeScript strict mode enabled
- ESLint passes with zero warnings

✅ **User Experience:**
- Cyberpunk-tech aesthetic matches cogitoGraph
- Smooth transitions between scenes
- Responsive design (mobile + desktop)
- Clear visual hierarchy (size + color encoding)

---

**Next Phase:** Implementation Planning with TDD task breakdown.
