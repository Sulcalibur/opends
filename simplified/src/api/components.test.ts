import { describe, it, expect } from 'vitest';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

describe('Components API', () => {
  it('should return design metadata for a valid component', async () => {
    const response = await axios.get(`${API_BASE_URL}/components/button/design`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('success', true);
    expect(response.data.metadata).toBeDefined();
    expect(response.data.metadata).toHaveProperty('tool', 'penpot');
  });

  it('should return 404 for an invalid component', async () => {
    await expect(
      axios.get(`${API_BASE_URL}/components/non-existent-component/design`)
    ).rejects.toHaveProperty('response.status', 404);
  });
});
